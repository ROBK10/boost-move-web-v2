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

export default router
