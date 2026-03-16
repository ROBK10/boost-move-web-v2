import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../db"

type ReqAny = Request & { user?: { id: string; role: string; companyId: string }; cookies?: any }

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me"
const COOKIE_NAME = process.env.COOKIE_NAME || "bm_token"

export async function attachUser(req: ReqAny, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token) return next()

    const payload = jwt.verify(token, JWT_SECRET) as any
    if (!payload?.userId) return next()

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, companyId: true },
    })

    if (user) {
      req.user = { id: user.id, role: user.role, companyId: user.companyId }
    }

    return next()
  } catch {
    return next()
  }
}
