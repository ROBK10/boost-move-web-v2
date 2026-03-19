import { Router } from "express"
import { prisma } from "../db"
import { requireAuth } from "../middleware/requireAuth"

const router = Router()

// Pilar-scoring (5 × 0–20 = 0–100)

function getUserId(req: any) {
  if (req.user?.id) return req.user.id
  throw new Error("Not authenticated")
}

function parseMonth(month: string) {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error("Invalid month format. Use YYYY-MM")
  }

  const [y, m] = month.split("-").map(Number)
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0))
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0))
  return { start, end }
}

function todayRange() {
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0))
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0))
  return { start, end }
}

function scoreFromPillars(input: {
  movement?: string   // bevegelse
  body?: string       // stillesitting
  energy?: string     // søvn
  context?: string    // kosthold
  mental?: string     // stressnivå
}) {
  // Bevegelse (0–20)
  const movementMap: Record<string, number> = {
    ingen: 0, lett: 8, moderat: 15, aktiv: 20,
    // Gamle verdier (bakoverkompatibilitet)
    ja: 15, litt: 8, nei: 0, under_30: 5, "30_60": 12, over_60: 20,
  }

  // Stillesitting (0–20)
  const bodyMap: Record<string, number> = {
    ingen_pauser: 0, noen: 10, regelmessig: 20,
    // Gamle verdier
    lett: 15, ok: 10, tung: 5,
    nei: 5, lett_aktivitet: 10, trening: 15,
  }

  // Søvn (0–20)
  const energyMap: Record<string, number> = {
    under_5: 0, "5_6": 8, "7_8": 20, over_8: 15,
    // Gamle verdier
    "på": 20, stabil: 12, tom: 3,
    hoy: 20, lav: 3,
  }

  // Kosthold (0–20)
  const contextMap: Record<string, number> = {
    ingen: 0, "1_2": 8, "3_4": 15, "5_pluss": 20,
    // Gamle verdier (kontekst ga ikke kostholdsdata)
    felt: 10, kontor: 10, hjemme: 10, trening: 10, pa_farten: 10,
  }

  // Mental helse (0–20)
  const mentalMap: Record<string, number> = {
    hoyt: 0, middels: 10, lavt: 20,
  }

  const m = movementMap[input.movement ?? "ingen"] ?? 0
  const b = bodyMap[input.body ?? "noen"] ?? 10
  const e = energyMap[input.energy ?? "7_8"] ?? 10
  const c = contextMap[input.context ?? "3_4"] ?? 10
  const mn = input.mental ? (mentalMap[input.mental] ?? 10) : 10

  return Math.max(0, Math.min(100, Math.round(m + b + e + c + mn)))
}

router.get("/today", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)
    const { start, end } = todayRange()

    const checkin = await prisma.dailyCheckIn.findFirst({
      where: {
        userId,
        date: { gte: start, lt: end },
      },
      orderBy: { date: "desc" },
    })

    return res.json({ checkin: checkin || null })
  } catch (err: any) {
    if (err?.message === "Not authenticated") {
      return res.status(401).json({ error: "Not authenticated" })
    }
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

router.post("/checkin", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)

    const {
      date,
      context,
      body,
      energy,
      movement,
      mental,
      workplace,
      capacityScore,
    } = req.body as {
      date?: string
      context?: string
      body?: string
      energy?: string
      movement?: string
      mental?: string
      workplace?: string
      capacityScore?: number
    }

    const d = date ? new Date(`${date}T00:00:00.000Z`) : new Date()
    const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0))

    const finalMovement = movement ?? "ingen"
    const finalBody = body ?? "noen"
    const finalEnergy = energy ?? "7_8"
    const finalContext = context ?? "3_4"
    const finalMental = mental ?? "middels"
    const finalWorkplace = workplace ?? null

    const finalCapacity =
      typeof capacityScore === "number" && Number.isFinite(capacityScore)
        ? Math.max(0, Math.min(100, Math.round(capacityScore)))
        : scoreFromPillars({
            movement: finalMovement,
            body: finalBody,
            energy: finalEnergy,
            context: finalContext,
            mental: finalMental,
          })

    const checkin = await prisma.dailyCheckIn.upsert({
      where: {
        userId_date: { userId, date: day },
      },
      update: {
        context: finalContext,
        body: finalBody,
        energy: finalEnergy,
        movement: finalMovement,
        mental: finalMental,
        workplace: finalWorkplace,
        capacityScore: finalCapacity,
      },
      create: {
        userId,
        date: day,
        context: finalContext,
        body: finalBody,
        energy: finalEnergy,
        movement: finalMovement,
        mental: finalMental,
        workplace: finalWorkplace,
        capacityScore: finalCapacity,
      },
    })

    return res.json({ checkin })
  } catch (err: any) {
    if (err?.message === "Not authenticated") {
      return res.status(401).json({ error: "Not authenticated" })
    }
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

router.get("/month", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)
    const month = String(req.query.month || "")
    const { start, end } = parseMonth(month)

    const checkins = await prisma.dailyCheckIn.findMany({
      where: { userId, date: { gte: start, lt: end } },
      orderBy: { date: "asc" },
    })

    let streak = 0
    let bestStreak = 0
    let prev: number | null = null

    for (const c of checkins) {
      const t = new Date(c.date).getTime()

      if (prev === null) {
        streak = 1
      } else {
        const diffDays = Math.round((t - prev) / (24 * 3600 * 1000))
        streak = diffDays === 1 ? streak + 1 : 1
      }

      prev = t
      bestStreak = Math.max(bestStreak, streak)
    }

    return res.json({ month, checkins, streak, bestStreak })
  } catch (err: any) {
    if (err?.message === "Not authenticated") {
      return res.status(401).json({ error: "Not authenticated" })
    }
    return res.status(400).json({ error: err?.message || "Bad request" })
  }
})

export default router