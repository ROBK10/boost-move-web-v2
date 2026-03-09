import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

type AuthedRequest = Request & {
  user?: { id?: string }
  cookies?: Record<string, string>
}

type JwtPayload = {
  userId: string
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me"
const COOKIE_NAME = process.env.COOKIE_NAME || "bm_token"

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  // 1) Hvis attachUser allerede har satt req.user, bruk den
  if (req.user?.id) {
    return next()
  }

  // 2) Fallback: les cookie direkte og verifiser JWT her også
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload

    if (!payload?.userId) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    req.user = { id: payload.userId }
    return next()
  } catch {
    return res.status(401).json({ error: "Not authenticated" })
  }
}