import { Router } from "express"
import { prisma } from "../db"
import { requireAuth } from "../middleware/requireAuth"

const router = Router()

function getUserId(req: any): string {
  if (req.user?.id) return req.user.id
  throw new Error("Not authenticated")
}

function getCompanyId(req: any): string {
  if (req.user?.companyId) return req.user.companyId
  throw new Error("No company")
}

// POST /pulse — lagre daglig puls
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)
    const companyId = getCompanyId(req)
    const { signal } = req.body as { signal?: string }

    const VALID = ["for_lite_tid", "mange_avbrytelser", "kroppen_sliten", "tung_mentalt", "lite_oversikt", "alt_ok"]
    if (!signal || !VALID.includes(signal)) {
      return res.status(400).json({ error: "Ugyldig signal" })
    }

    const now = new Date()
    const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

    const pulse = await prisma.dailyPulse.upsert({
      where: { userId_date: { userId, date: day } },
      update: { signal, companyId },
      create: { userId, companyId, date: day, signal },
    })

    return res.json({ pulse })
  } catch (err: any) {
    if (err?.message === "Not authenticated") return res.status(401).json({ error: err.message })
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

// GET /pulse/aggregate — anonymisert data for admin (siste 7 + 30 dager)
router.get("/aggregate", requireAuth, async (req, res) => {
  try {
    const companyId = getCompanyId(req)

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 86400000)
    const monthAgo = new Date(now.getTime() - 30 * 86400000)
    const prevMonthStart = new Date(now.getTime() - 60 * 86400000)

    // Siste 7 dager
    const weekPulses = await prisma.dailyPulse.findMany({
      where: { companyId, date: { gte: weekAgo } },
      select: { signal: true },
    })

    // Siste 30 dager
    const monthPulses = await prisma.dailyPulse.findMany({
      where: { companyId, date: { gte: monthAgo } },
      select: { signal: true },
    })

    // Forrige 30-dagers periode (for trend)
    const prevPulses = await prisma.dailyPulse.findMany({
      where: { companyId, date: { gte: prevMonthStart, lt: monthAgo } },
      select: { signal: true },
    })

    function countSignals(pulses: { signal: string }[]) {
      const counts: Record<string, number> = {}
      for (const p of pulses) {
        counts[p.signal] = (counts[p.signal] || 0) + 1
      }
      const total = pulses.length || 1
      return Object.entries(counts)
        .map(([signal, count]) => ({
          signal,
          count,
          pct: Math.round((count / total) * 100),
        }))
        .sort((a, b) => b.count - a.count)
    }

    const weekData = countSignals(weekPulses)
    const monthData = countSignals(monthPulses)
    const prevData = countSignals(prevPulses)

    // Beregn trend per signal
    const trends: Record<string, number> = {}
    for (const m of monthData) {
      const prev = prevData.find(p => p.signal === m.signal)
      trends[m.signal] = prev ? m.pct - prev.pct : 0
    }

    return res.json({
      week: { total: weekPulses.length, signals: weekData },
      month: { total: monthPulses.length, signals: monthData },
      trends,
    })
  } catch (err: any) {
    if (err?.message === "Not authenticated") return res.status(401).json({ error: err.message })
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

export default router
