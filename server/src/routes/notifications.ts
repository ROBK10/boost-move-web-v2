import { Router } from "express"
import webpush from "web-push"
import { prisma } from "../db"
import { requireAuth } from "../middleware/requireAuth"

const router = Router()

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || ""
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || ""
const VAPID_EMAIL = process.env.VAPID_EMAIL || "mailto:dev@boostmove.no"

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE)
}

function getUserId(req: any): string {
  if (req.user?.id) return req.user.id
  throw new Error("Not authenticated")
}

// GET /notifications/vapid-key — public key for frontend
router.get("/vapid-key", (_req, res) => {
  res.json({ publicKey: VAPID_PUBLIC })
})

// POST /notifications/subscribe — lagre push-subscription
router.post("/subscribe", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)
    const { endpoint, keys } = req.body as {
      endpoint: string
      keys: { p256dh: string; auth: string }
    }

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ error: "Invalid subscription" })
    }

    await prisma.pushSubscription.upsert({
      where: { userId_endpoint: { userId, endpoint } },
      update: { p256dh: keys.p256dh, auth: keys.auth },
      create: { userId, endpoint, p256dh: keys.p256dh, auth: keys.auth },
    })

    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

// POST /notifications/unsubscribe — fjern subscription
router.post("/unsubscribe", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)
    const { endpoint } = req.body as { endpoint: string }

    await prisma.pushSubscription.deleteMany({
      where: { userId, endpoint },
    })

    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

// POST /notifications/test — send test-notifikasjon til seg selv
router.post("/test", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)
    const subs = await prisma.pushSubscription.findMany({ where: { userId } })

    const payload = JSON.stringify({
      title: "Boost Move",
      body: "Har du sjekket inn i dag? 5 trykk — det tar 10 sekunder.",
      icon: "/pwa-192x192.png",
      url: "/min-helse",
    })

    let sent = 0
    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
        sent++
      } catch {
        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
      }
    }

    return res.json({ ok: true, sent })
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

// ── Smart notifikasjoner (kalles fra cron/scheduler) ──────────────────────

async function sendToUser(userId: string, title: string, body: string, url: string) {
  const subs = await prisma.pushSubscription.findMany({ where: { userId } })
  const payload = JSON.stringify({ title, body, icon: "/pwa-192x192.png", url })

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
    } catch {
      await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
    }
  }
}

// POST /notifications/send-daily — smart daglig notifikasjon for alle brukere
// Kalles én gang daglig fra cron (f.eks. kl 09:00)
router.post("/send-daily", async (req, res) => {
  // Enkel auth-sjekk for cron (API-nøkkel)
  const cronKey = req.headers["x-cron-key"]
  if (cronKey !== (process.env.CRON_SECRET || "boost-cron-dev")) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const users = await prisma.user.findMany({
      where: { notifyDaily: true },
      select: {
        id: true,
        name: true,
        weeklyGoal: true,
        pushSubscriptions: { select: { id: true } },
      },
    })

    // Kun brukere med push-subscriptions
    const eligible = users.filter(u => u.pushSubscriptions.length > 0)

    const today = new Date()
    const todayStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
    const todayEnd = new Date(todayStart.getTime() + 86400000)
    const weekAgo = new Date(todayStart.getTime() - 7 * 86400000)
    const threeDaysAgo = new Date(todayStart.getTime() - 3 * 86400000)
    const isFriday = today.getDay() === 5

    let sent = 0

    for (const user of eligible) {
      // Sjekk dagens innsjekk
      const todayCheckin = await prisma.dailyCheckIn.findFirst({
        where: { userId: user.id, date: { gte: todayStart, lt: todayEnd } },
      })

      // Sjekk boosts i dag
      const todayBoost = await prisma.boostEntry.findFirst({
        where: { userId: user.id, completedAt: { gte: todayStart, lt: todayEnd } },
      })

      // Allerede gjort begge deler — ingen notifikasjon
      if (todayCheckin && todayBoost) continue

      // Sjekk streak
      const recentCheckins = await prisma.dailyCheckIn.findMany({
        where: { userId: user.id, date: { gte: weekAgo } },
        orderBy: { date: "desc" },
      })

      // Sjekk om bruker har vært inaktiv 3+ dager
      const lastCheckin = recentCheckins[0]
      const isInactive = !lastCheckin || new Date(lastCheckin.date) < threeDaysAgo

      // Ukens minutter
      const weeklyMinutes = recentCheckins.reduce((sum, c) => {
        const mins = parseInt(c.movement) || 0
        return sum + mins
      }, 0)

      const firstName = user.name.split(" ")[0]
      const goal = user.weeklyGoal ?? 150

      // Velg melding basert på situasjon (kun 1 per dag, ingen mas)
      let title = "Boost Move"
      let body = ""
      let url = "/min-helse"

      if (isInactive) {
        // 3+ dager uten innsjekk — vennlig
        body = `Hei ${firstName}! En liten innsjekk tar 10 sekunder.`
      } else if (isFriday && weeklyMinutes >= goal) {
        // Nådd ukemålet — feiring!
        title = "Bra jobbet!"
        body = `Du nådde ${goal} min denne uken. Nyt helgen!`
        url = "/hjem"
      } else if (recentCheckins.length >= 3 && !todayCheckin) {
        // Streak pågår — motiver
        body = `${recentCheckins.length} dager på rad — fortsett i dag?`
      } else if (todayCheckin && !todayBoost) {
        // Har sjekket inn men ikke boost — midt på dagen
        body = `Tid for en liten boost?`
        url = "/movin/boost-moment"
      } else if (!todayCheckin) {
        // Standard: ikke sjekket inn
        body = `Klar for å logge bevegelsen din i dag?`
      } else {
        // Har gjort alt — skip
        continue
      }

      await sendToUser(user.id, title, body, url)
      sent++
    }

    return res.json({ ok: true, sent, total: eligible.length })
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

export default router
