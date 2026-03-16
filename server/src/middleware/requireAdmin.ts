import type { Request, Response, NextFunction } from "express"

type AuthedRequest = Request & {
  user?: { id: string; role: string; companyId: string }
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user?.role || req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" })
  }
  return next()
}
