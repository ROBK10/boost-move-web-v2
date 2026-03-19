import { Router } from "express"
import { prisma } from "../db"
import { requireAuth } from "../middleware/requireAuth"

const router = Router()

function getUserId(req: any) {
  if (req.user?.id) return req.user.id
  throw new Error("Not authenticated")
}

// GET /trainer/profile — hent brukerens treningsprofil (eller null)
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)

    const profile = await prisma.trainerProfile.findUnique({
      where: { userId },
    })

    return res.json({ profile: profile || null })
  } catch (err: any) {
    if (err?.message === "Not authenticated") {
      return res.status(401).json({ error: "Not authenticated" })
    }
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

// POST /trainer/profile — opprett/oppdater treningsprofil
router.post("/profile", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)

    const {
      workType,
      cardioLevel,
      strengthLevel,
      equipment,
      sessionDuration,
      programWeek,
    } = req.body as {
      workType: string
      cardioLevel: string
      strengthLevel: string
      equipment: string[]
      sessionDuration: number
      programWeek?: number
    }

    const profile = await prisma.trainerProfile.upsert({
      where: { userId },
      update: {
        workType,
        cardioLevel,
        strengthLevel,
        equipment,
        sessionDuration,
        ...(programWeek != null ? { programWeek } : {}),
      },
      create: {
        userId,
        workType,
        cardioLevel,
        strengthLevel,
        equipment,
        sessionDuration,
        programWeek: programWeek ?? 1,
        programStartDate: new Date(),
      },
    })

    return res.json({ profile })
  } catch (err: any) {
    if (err?.message === "Not authenticated") {
      return res.status(401).json({ error: "Not authenticated" })
    }
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

// GET /trainer/logs — hent treningslogger for brukeren
router.get("/logs", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)

    const logs = await prisma.workoutLog.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: 50,
    })

    return res.json({ logs })
  } catch (err: any) {
    if (err?.message === "Not authenticated") {
      return res.status(401).json({ error: "Not authenticated" })
    }
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

// POST /trainer/log — lagre en fullfort treningsokt
router.post("/log", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)

    const { week, sessionData, durationMin, feltScore } = req.body as {
      week: number
      sessionData: any
      durationMin?: number
      feltScore?: number
    }

    const log = await prisma.workoutLog.create({
      data: {
        userId,
        week,
        sessionData: typeof sessionData === "string" ? sessionData : JSON.stringify(sessionData),
        durationMin: durationMin ?? null,
        feltScore: feltScore ?? null,
      },
    })

    // Oppdater programWeek til neste uke hvis aktuelt
    const profile = await prisma.trainerProfile.findUnique({ where: { userId } })
    if (profile) {
      const logsThisWeek = await prisma.workoutLog.count({
        where: { userId, week },
      })
      // Etter 3 okter per uke, gaa til neste uke (maks 16)
      if (logsThisWeek >= 3 && profile.programWeek === week && week < 16) {
        await prisma.trainerProfile.update({
          where: { userId },
          data: { programWeek: week + 1 },
        })
      }
    }

    return res.json({ log })
  } catch (err: any) {
    if (err?.message === "Not authenticated") {
      return res.status(401).json({ error: "Not authenticated" })
    }
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

export default router
