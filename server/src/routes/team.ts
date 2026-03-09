import { Router } from "express"
import { prisma } from "../db"
import { requireAuth } from "../middleware/requireAuth"

const router = Router()

function getUserId(req: any): string {
  if (req.user?.id) return req.user.id
  throw new Error("Not authenticated")
}

function utcDayRange(offsetDays: number) {
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offsetDays, 0, 0, 0))
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offsetDays + 1, 0, 0, 0))
  return { start, end }
}

function avgScore(checkins: { capacityScore: number }[]): number | null {
  if (checkins.length === 0) return null
  const sum = checkins.reduce((acc, c) => acc + c.capacityScore, 0)
  return Math.round(sum / checkins.length)
}

function calcTrend(today: number | null, yesterday: number | null): "up" | "down" | "stable" {
  if (today === null || yesterday === null) return "stable"
  const diff = today - yesterday
  if (diff > 5) return "up"
  if (diff < -5) return "down"
  return "stable"
}

// GET /team/status
router.get("/status", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)

    // Resolve requesting user's companyId
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true },
    })

    if (!user) {
      return res.status(401).json({ error: "User not found" })
    }

    const { companyId } = user

    // Today's teammate checkins (same company, exclude self)
    const todayRange = utcDayRange(0)
    const todayCheckins = await prisma.dailyCheckIn.findMany({
      where: {
        date: { gte: todayRange.start, lt: todayRange.end },
        userId: { not: userId },
        user: { companyId },
      },
      select: { capacityScore: true },
    })

    // Privacy threshold: require at least 2 teammates
    if (todayCheckins.length < 2) {
      return res.json({ available: false })
    }

    const todayAvg = avgScore(todayCheckins)

    // Yesterday's teammate checkins for trend
    const yesterdayRange = utcDayRange(-1)
    const yesterdayCheckins = await prisma.dailyCheckIn.findMany({
      where: {
        date: { gte: yesterdayRange.start, lt: yesterdayRange.end },
        userId: { not: userId },
        user: { companyId },
      },
      select: { capacityScore: true },
    })

    const yesterdayAvg = avgScore(yesterdayCheckins)

    return res.json({
      available: true,
      avgScore: todayAvg,
      trend: calcTrend(todayAvg, yesterdayAvg),
      participantCount: todayCheckins.length,
    })
  } catch (err: any) {
    if (err?.message === "Not authenticated") {
      return res.status(401).json({ error: "Not authenticated" })
    }
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

export default router
