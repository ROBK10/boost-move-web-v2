import { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../db"

const router = Router()

function signToken(userId: string) {
  const secret = process.env.JWT_SECRET!
  return jwt.sign({ sub: userId }, secret, { expiresIn: "7d" })
}

function setAuthCookie(res: any, token: string) {
  res.cookie(process.env.COOKIE_NAME || "boostmove_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true i prod (https)
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

router.post("/register", async (req, res) => {
  const { email, name, password, companyName } = req.body as {
    email: string
    name: string
    password: string
    companyName?: string
  }

  if (!email || !name || !password) return res.status(400).json({ error: "Missing fields" })

  // Dev: opprett en "demo company" hvis ingen kode/invite ennå
  const code = (companyName || "Demo").toLowerCase().replace(/\s+/g, "-") + "-demo"
  const company = await prisma.company.upsert({
    where: { code },
    update: {},
    create: { code, name: companyName || "Demo Company" },
  })

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      passwordHash,
      companyId: company.id,
      role: "member",
    },
    select: { id: true, email: true, name: true, role: true, companyId: true },
  })

  const token = signToken(user.id)
  setAuthCookie(res, token)

  res.json({ user })
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string }
  if (!email || !password) return res.status(400).json({ error: "Missing fields" })

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) return res.status(401).json({ error: "Invalid credentials" })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: "Invalid credentials" })

  const token = signToken(user.id)
  setAuthCookie(res, token)

  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, companyId: user.companyId } })
})

router.get("/me", async (req, res) => {
  const cookieName = process.env.COOKIE_NAME || "boostmove_token"
  const token = req.cookies?.[cookieName]
  if (!token) return res.status(401).json({ error: "Not authenticated" })

  try {
    const secret = process.env.JWT_SECRET!
    const payload = jwt.verify(token, secret) as { sub: string }
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true, companyId: true },
    })
    if (!user) return res.status(401).json({ error: "Not authenticated" })
    res.json({ user })
  } catch {
    res.status(401).json({ error: "Not authenticated" })
  }
})

router.post("/logout", async (_req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || "boostmove_token")
  res.json({ ok: true })
})

export default router