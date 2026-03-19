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
        // Subscription expired — clean up
        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
      }
    }

    return res.json({ ok: true, sent })
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

export default router
