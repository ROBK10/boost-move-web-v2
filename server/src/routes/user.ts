import { Router, Request, Response } from "express"
import multer from "multer"
import path from "path"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const router = Router()

// ── Avatar upload ────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: path.join(process.cwd(), "uploads", "avatars"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg"
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    cb(null, name)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true)
    cb(new Error("Kun bildefiler er tillatt"))
  },
})

router.post("/avatar", upload.single("avatar"), async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "Ikke autentisert" })
  if (!req.file) return res.status(400).json({ error: "Ingen fil lastet opp" })

  const avatarUrl = `/uploads/avatars/${req.file.filename}`

  try {
    await (prisma.user as any).update({
      where: { id: userId },
      data: { avatarUrl },
    })
    res.json({ avatarUrl })
  } catch {
    res.status(500).json({ error: "Kunne ikke lagre avatar" })
  }
})

// ── Update profile ───────────────────────────────────────────────
router.patch("/me", async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "Ikke autentisert" })

  const { name, bio } = req.body as { name?: string; bio?: string }
  const data: Record<string, string> = {}
  if (name?.trim()) data.name = name.trim()
  if (bio !== undefined) data.bio = bio

  try {
    const updated = await (prisma.user as any).update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, role: true, companyId: true, bio: true, avatarUrl: true },
    })
    res.json({ user: updated })
  } catch {
    res.status(500).json({ error: "Kunne ikke oppdatere profil" })
  }
})

// ── Change password ──────────────────────────────────────────────
import bcrypt from "bcrypt"

router.post("/change-password", async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "Ikke autentisert" })

  const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string }
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Fyll ut alle feltene" })
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "Nytt passord må være minst 8 tegn" })
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(404).json({ error: "Bruker ikke funnet" })

    const match = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!match) return res.status(400).json({ error: "Nåværende passord er feil" })

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } })

    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: "Noe gikk galt" })
  }
})

export default router
