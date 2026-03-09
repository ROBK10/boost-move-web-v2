import type { Request, Response, NextFunction } from "express"

type AuthedRequest = Request & {
  user?: { id?: string }
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  return next()
}