import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

type ReqAny = Request & { user?: { id: string }; cookies?: any }

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me"
const COOKIE_NAME = process.env.COOKIE_NAME || "bm_token"

export function attachUser(req: ReqAny, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token) return next()

    const payload = jwt.verify(token, JWT_SECRET) as any
    if (payload?.userId) {
      req.user = { id: payload.userId }
    }

    return next()
  } catch {
    return next()
  }
}