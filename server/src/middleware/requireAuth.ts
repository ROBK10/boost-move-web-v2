import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../db"

type AuthedRequest = Request & {
  user?: { id: string; role: string; companyId: string }
  cookies?: Record<string, string>
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me"
const COOKIE_NAME = process.env.COOKIE_NAME || "bm_token"

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  // 1) Hvis attachUser allerede har satt req.user, bruk den
  if (req.user?.id) {
    return next()
  }

  // 2) Fallback: les cookie direkte og hent bruker fra DB
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    if (!payload?.userId) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, companyId: true },
    })

    if (!user) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    req.user = { id: user.id, role: user.role, companyId: user.companyId }
    return next()
  } catch {
    return res.status(401).json({ error: "Not authenticated" })
  }
}
