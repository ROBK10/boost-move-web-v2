import { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../db"

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me"
const COOKIE_NAME = process.env.COOKIE_NAME || "bm_token"
const IS_PROD = process.env.NODE_ENV === "production"

function makeCompanyCode(companyName: string) {
  const slug = companyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24)

  const rand = Math.random().toString(16).slice(2, 6)
  return `${slug || "company"}-${rand}`
}

function signToken(payload: { userId: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" })
}

function setAuthCookie(res: any, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: IS_PROD ? "none" : "lax",
    secure: IS_PROD,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  })
}

function clearAuthCookie(res: any) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: IS_PROD ? "none" : "lax",
    secure: IS_PROD,
    path: "/",
  })
}

async function getUserSafe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      companyId: true,
      bio: true,
      avatarUrl: true,
      company: { select: { name: true } },
    },
  })
  if (!user) return null
  const { company, ...rest } = user
  return { ...rest, companyName: company?.name ?? null }
}

function readToken(req: any) {
  const authHeader = req.headers?.authorization
  return (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null)
    || req.cookies?.[COOKIE_NAME]
    || null
}

router.get("/me", async (req, res) => {
  try {
    const token = readToken(req)
    if (!token) return res.status(401).json({ error: "Not authenticated" })

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const user = await getUserSafe(decoded.userId)
    if (!user) return res.status(401).json({ error: "Not authenticated" })

    return res.json({ user })
  } catch {
    return res.status(401).json({ error: "Not authenticated" })
  }
})

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, companyName, companyCode } = req.body as {
      name?: string
      email?: string
      password?: string
      companyName?: string
      companyCode?: string
    }

    if (!name || !email || !password || !companyCode) {
      return res.status(400).json({ error: "Bedriftskode er påkrevd" })
    }

    const company = await prisma.company.findUnique({ where: { code: companyCode } })
    if (!company) return res.status(400).json({ error: "Ugyldig bedriftskode" })

    const companyId = company.id

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: "E-post er allerede i bruk" })

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        companyId: companyId!,
      },
      select: { id: true, email: true, name: true, role: true, companyId: true },
    })

    const token = signToken({ userId: user.id })
    setAuthCookie(res, token)

    return res.json({ user, token })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string }
    if (!email || !password) return res.status(400).json({ error: "Missing fields" })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ error: "Feil e-post eller passord" })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(400).json({ error: "Feil e-post eller passord" })

    const token = signToken({ userId: user.id })
    setAuthCookie(res, token)

    const safe = await getUserSafe(user.id)
    return res.json({ user: safe, token })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
})

router.post("/logout", async (_req, res) => {
  clearAuthCookie(res)
  return res.json({ ok: true })
})

export default router