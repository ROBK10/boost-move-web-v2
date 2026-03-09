import { Router } from "express"
import { prisma } from "../db"
import { requireAuth } from "../middleware/requireAuth"

const router = Router()

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

// POST /boosts/complete
router.post("/complete", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)
    const { type, durationSeconds } = req.body as {
      type?: string
      durationSeconds?: number
    }

    if (!type || typeof type !== "string") {
      return res.status(400).json({ error: "type is required" })
    }

    if (typeof durationSeconds !== "number" || durationSeconds <= 0) {
      return res.status(400).json({ error: "durationSeconds must be a positive number" })
    }

    const session = await prisma.boostEntry.create({
      data: {
        userId,
        type,
        durationSeconds: Math.round(durationSeconds),
      },
    })

    return res.json({ session })
  } catch (err: any) {
    if (err?.message === "Not authenticated") {
      return res.status(401).json({ error: "Not authenticated" })
    }
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

// GET /boosts/month?month=YYYY-MM
router.get("/month", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)
    const month = String(req.query.month || "")
    const { start, end } = parseMonth(month)

    const entries = await prisma.boostEntry.findMany({
      where: {
        userId,
        completedAt: { gte: start, lt: end },
      },
      orderBy: { completedAt: "asc" },
    })

    const total = entries.length

    const byType: Record<string, number> = {}
    for (const e of entries) {
      byType[e.type] = (byType[e.type] ?? 0) + 1
    }

    return res.json({ month, total, byType })
  } catch (err: any) {
    if (err?.message === "Not authenticated") {
      return res.status(401).json({ error: "Not authenticated" })
    }
    return res.status(400).json({ error: err?.message || "Bad request" })
  }
})

export default router
