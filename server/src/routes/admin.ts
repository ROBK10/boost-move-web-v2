import { Router } from "express"
import bcrypt from "bcrypt"
import { prisma } from "../db"
import { requireAuth } from "../middleware/requireAuth"
import { requireAdmin } from "../middleware/requireAdmin"

const router = Router()

// Alle admin-ruter krever innlogging + admin-rolle
router.use(requireAuth, requireAdmin)

// ── Tilbakemeldinger ────────────────────────────────────────────────────────

// GET /admin/wishes — alle tilbakemeldinger med bedriftsnavn, nyeste først
router.get("/wishes", async (_req, res) => {
  try {
    const wishes = await prisma.workplaceWish.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        company: { select: { name: true } },
      },
    })

    const data = wishes.map((w) => ({
      id: w.id,
      companyId: w.companyId,
      companyName: w.company.name,
      month: w.month,
      selected: w.selected,
      annetText: w.annetText,
      createdAt: w.createdAt,
    }))

    return res.json({ wishes: data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
})

// ── Bedrifter ───────────────────────────────────────────────────────────────

// GET /admin/companies — alle bedrifter med antall brukere
router.get("/companies", async (_req, res) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { users: true } },
      },
    })

    const data = companies.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      userCount: c._count.users,
      createdAt: c.createdAt,
    }))

    return res.json({ companies: data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
})

// ── Brukere ─────────────────────────────────────────────────────────────────

// GET /admin/users — alle brukere med bedriftsnavn
router.get("/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        createdAt: true,
        company: { select: { name: true } },
      },
    })

    const data = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      companyId: u.companyId,
      companyName: u.company.name,
      createdAt: u.createdAt,
    }))

    return res.json({ users: data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
})

// POST /admin/users — opprett ny bruker
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, companyId, role } = req.body as {
      name?: string
      email?: string
      password?: string
      companyId?: string
      role?: string
    }

    if (!name || !email || !password || !companyId) {
      return res.status(400).json({ error: "name, email, password og companyId er påkrevd" })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: "E-post er allerede i bruk" })

    const company = await prisma.company.findUnique({ where: { id: companyId } })
    if (!company) return res.status(400).json({ error: "Bedrift ikke funnet" })

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        companyId,
        role: role || "member",
      },
      select: { id: true, name: true, email: true, role: true, companyId: true, createdAt: true },
    })

    return res.json({ ok: true, user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
})

// PATCH /admin/users/:id — endre rolle eller bedrift
router.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { role, companyId } = req.body as { role?: string; companyId?: string }

    const data: any = {}
    if (role !== undefined) data.role = role
    if (companyId !== undefined) {
      const company = await prisma.company.findUnique({ where: { id: companyId } })
      if (!company) return res.status(400).json({ error: "Bedrift ikke funnet" })
      data.companyId = companyId
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, companyId: true },
    })

    return res.json({ ok: true, user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
})

// GET /admin/dashboard — aggregerte KPI-er for bedriften
router.get("/dashboard", async (req, res) => {
  try {
    const userId = (req as any).user?.id
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { companyId: true } })
    if (!user) return res.status(401).json({ error: "User not found" })

    const { companyId } = user
    const now = new Date()
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))

    // Totalt antall ansatte i bedriften
    const totalEmployees = await prisma.user.count({ where: { companyId } })

    // Unike brukere som har sjekket inn denne måneden
    const monthCheckins = await prisma.dailyCheckIn.findMany({
      where: {
        user: { companyId },
        date: { gte: monthStart, lt: monthEnd },
      },
      select: { userId: true, capacityScore: true, movement: true, body: true, energy: true, context: true, mental: true },
    })

    const uniqueUsers = new Set(monthCheckins.map((c) => c.userId))
    const participationRate = totalEmployees > 0 ? Math.round((uniqueUsers.size / totalEmployees) * 100) : 0

    // Gjennomsnittlig helsescore
    const avgScore = monthCheckins.length > 0
      ? Math.round(monthCheckins.reduce((sum, c) => sum + c.capacityScore, 0) / monthCheckins.length)
      : 0

    // Pilar-gjennomsnitt (for å finne svakeste)
    const pillarScores: Record<string, { sum: number; count: number }> = {
      bevegelse: { sum: 0, count: 0 },
      stillesitting: { sum: 0, count: 0 },
      sovn: { sum: 0, count: 0 },
      kosthold: { sum: 0, count: 0 },
      mental: { sum: 0, count: 0 },
    }

    const movementMap: Record<string, number> = { ingen: 0, lett: 8, moderat: 15, aktiv: 20, ja: 15, litt: 8, nei: 0, under_30: 5, "30_60": 12, over_60: 20 }
    const bodyMap: Record<string, number> = { ingen_pauser: 0, noen: 10, regelmessig: 20, lett: 15, ok: 10, tung: 5 }
    const energyMap: Record<string, number> = { under_5: 0, "5_6": 8, "7_8": 20, over_8: 15, "på": 20, stabil: 12, tom: 3 }
    const contextMap: Record<string, number> = { ingen: 0, "1_2": 8, "3_4": 15, "5_pluss": 20 }
    const mentalMap: Record<string, number> = { hoyt: 0, middels: 10, lavt: 20 }

    for (const c of monthCheckins) {
      pillarScores.bevegelse.sum += movementMap[c.movement] ?? 10
      pillarScores.bevegelse.count++
      pillarScores.stillesitting.sum += bodyMap[c.body] ?? 10
      pillarScores.stillesitting.count++
      pillarScores.sovn.sum += energyMap[c.energy] ?? 10
      pillarScores.sovn.count++
      pillarScores.kosthold.sum += contextMap[c.context] ?? 10
      pillarScores.kosthold.count++
      if (c.mental) {
        pillarScores.mental.sum += mentalMap[c.mental] ?? 10
        pillarScores.mental.count++
      }
    }

    const pillarAverages = Object.entries(pillarScores)
      .filter(([, v]) => v.count > 0)
      .map(([key, v]) => ({
        pillar: key,
        avg: Math.round((v.sum / v.count) * 10) / 10,
        pct: Math.round((v.sum / v.count / 20) * 100),
      }))
      .sort((a, b) => a.avg - b.avg)

    // Helsegevinst estimat (forenklet)
    const DAILY_RATES: Record<string, number> = { inactive: 0, partial: 200, active: 360, extra: 420 }
    const activeDays = monthCheckins.filter((c) => (movementMap[c.movement] ?? 0) >= 8).length
    const avgMovement = monthCheckins.length > 0
      ? monthCheckins.reduce((s, c) => s + (movementMap[c.movement] ?? 0), 0) / monthCheckins.length
      : 0
    const level = avgMovement >= 15 ? "active" : avgMovement >= 8 ? "partial" : "inactive"
    const monthlySavings = activeDays * (DAILY_RATES[level] ?? 0)

    // ROI: estimer årlig besparelse vs. typisk Boost Move-kostnad
    const annualSavings = monthlySavings * 12
    const estimatedAnnualCost = totalEmployees * 200 * 12 // ~200 kr/ansatt/mnd estimat
    const roiPercent = estimatedAnnualCost > 0 ? Math.round((annualSavings / estimatedAnnualCost) * 100) : 0

    // Trenddata: siste 6 måneder
    const trendData: { month: string; participation: number; avgScore: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const tMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))
      const tEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i + 1, 1))
      const tCheckins = await prisma.dailyCheckIn.findMany({
        where: { user: { companyId }, date: { gte: tMonth, lt: tEnd } },
        select: { userId: true, capacityScore: true },
      })
      const tUnique = new Set(tCheckins.map((c) => c.userId))
      const tAvg = tCheckins.length > 0
        ? Math.round(tCheckins.reduce((s, c) => s + c.capacityScore, 0) / tCheckins.length)
        : 0
      const mLabel = tMonth.toLocaleDateString("nb-NO", { month: "short" })
      trendData.push({
        month: mLabel,
        participation: totalEmployees > 0 ? Math.round((tUnique.size / totalEmployees) * 100) : 0,
        avgScore: tAvg,
      })
    }

    return res.json({
      totalEmployees,
      activeUsers: uniqueUsers.size,
      participationRate,
      avgScore,
      totalCheckins: monthCheckins.length,
      monthlySavings,
      annualSavings,
      roiPercent,
      pillarAverages,
      weakestPillar: pillarAverages[0] ?? null,
      trendData,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
})

export default router
