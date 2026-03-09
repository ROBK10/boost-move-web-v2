import { Router } from "express"
import { prisma } from "../db"
import { requireAuth } from "../middleware/requireAuth"

const router = Router()

type Context = "felt" | "kontor" | "hjemme" | "trening" | "pa_farten"
type BodyState = "lett" | "ok" | "tung"
type EnergyState = "på" | "stabil" | "tom"
type MovementState = "ja" | "litt" | "nei"

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

function scoreFromWizard(input: {
  body?: BodyState
  energy?: EnergyState
  movement?: MovementState
}) {
  let score = 65

  if (input.body === "lett") score += 10
  if (input.body === "ok") score += 0
  if (input.body === "tung") score -= 12

  if (input.energy === "på") score += 15
  if (input.energy === "stabil") score += 0
  if (input.energy === "tom") score -= 18

  if (input.movement === "ja") score += 10
  if (input.movement === "litt") score += 4
  if (input.movement === "nei") score -= 6

  return Math.max(0, Math.min(100, Math.round(score)))
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
      capacityScore,
    } = req.body as {
      date?: string
      context?: Context
      body?: BodyState
      energy?: EnergyState
      movement?: MovementState
      capacityScore?: number
    }

    if (!context) {
      return res.status(400).json({ error: "context is required" })
    }

    const allowedContexts = ["felt", "kontor", "hjemme", "trening", "pa_farten"]
    if (!allowedContexts.includes(context)) {
      return res.status(400).json({ error: "Invalid context" })
    }

    const d = date ? new Date(`${date}T00:00:00.000Z`) : new Date()
    const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0))

    const finalBody = body ?? "ok"
    const finalEnergy = energy ?? "stabil"
    const finalMovement = movement ?? "litt"

    const finalCapacity =
      typeof capacityScore === "number" && Number.isFinite(capacityScore)
        ? Math.max(0, Math.min(100, Math.round(capacityScore)))
        : scoreFromWizard({
            body: finalBody,
            energy: finalEnergy,
            movement: finalMovement,
          })

    const checkin = await prisma.dailyCheckIn.upsert({
      where: {
        userId_date: { userId, date: day },
      },
      update: {
        context,
        body: finalBody,
        energy: finalEnergy,
        movement: finalMovement,
        capacityScore: finalCapacity,
      },
      create: {
        userId,
        date: day,
        context,
        body: finalBody,
        energy: finalEnergy,
        movement: finalMovement,
        capacityScore: finalCapacity,
      },
    })

    return res.json({
      checkin,
      boost: {
        band:
          finalCapacity < 45 ? "low" : finalCapacity < 70 ? "stable" : "high",
        title:
          finalCapacity < 45
            ? "Lav kapasitet i dag"
            : finalCapacity < 70
              ? "Stabil kapasitet i dag"
              : "Høy kapasitet i dag",
        message:
          finalCapacity < 45
            ? "Kroppen signaliserer at du bør holde det enkelt."
            : finalCapacity < 70
              ? "Du virker stabil. Små ting kan gi litt ekstra."
              : "Du er i flyt. Hold det jevnt og smart.",
        suggestions:
          finalCapacity < 45
            ? ["Drikk vann", "3 rolige pust", "20 sek lett bevegelse"]
            : finalCapacity < 70
              ? ["Reis deg litt", "Rull skuldrene", "Kort pustepause"]
              : ["Hold flyten", "Litt mobilitet", "Ett lite neste steg"],
      },
    })
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