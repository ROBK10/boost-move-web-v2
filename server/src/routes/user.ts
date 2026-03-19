import { Router, Request, Response } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
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

// ── InBody scan upload ───────────────────────────────────────────
const inbodyDir = path.join(process.cwd(), "uploads", "inbody")
if (!fs.existsSync(inbodyDir)) fs.mkdirSync(inbodyDir, { recursive: true })

const inbodyStorage = multer.diskStorage({
  destination: inbodyDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg"
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    cb(null, name)
  },
})

const inbodyUpload = multer({
  storage: inbodyStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") return cb(null, true)
    cb(new Error("Kun bilder eller PDF er tillatt"))
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

  const { name, bio, onboardingDone, weeklyGoal, focusPillars, notifyDaily, notifyTime } = req.body as {
    name?: string
    bio?: string
    onboardingDone?: boolean
    weeklyGoal?: number
    focusPillars?: string
    notifyDaily?: boolean
    notifyTime?: string
  }
  const data: Record<string, any> = {}
  if (name?.trim()) data.name = name.trim()
  if (bio !== undefined) data.bio = bio
  if (onboardingDone !== undefined) data.onboardingDone = onboardingDone
  if (weeklyGoal !== undefined) data.weeklyGoal = weeklyGoal
  if (focusPillars !== undefined) data.focusPillars = focusPillars
  if (notifyDaily !== undefined) data.notifyDaily = notifyDaily
  if (notifyTime !== undefined) data.notifyTime = notifyTime

  try {
    const updated = await (prisma.user as any).update({
      where: { id: userId },
      data,
      select: {
        id: true, email: true, name: true, role: true, companyId: true,
        bio: true, avatarUrl: true, onboardingDone: true, weeklyGoal: true,
        focusPillars: true, notifyDaily: true, notifyTime: true,
      },
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

// ── InBody scan: upload ──────────────────────────────────────────
router.post("/inbody", inbodyUpload.single("scan"), async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "Ikke autentisert" })

  const { weight, bodyFatPct, muscleMass, bmi, bodyWater, visceralFat, basalMetab, scanDate, notes } = req.body as Record<string, string>

  const imageUrl = req.file ? `/uploads/inbody/${req.file.filename}` : null

  try {
    const scan = await prisma.inBodyScan.create({
      data: {
        userId,
        scanDate: scanDate ? new Date(scanDate) : new Date(),
        imageUrl,
        weight: weight ? parseFloat(weight) : null,
        bodyFatPct: bodyFatPct ? parseFloat(bodyFatPct) : null,
        muscleMass: muscleMass ? parseFloat(muscleMass) : null,
        bmi: bmi ? parseFloat(bmi) : null,
        bodyWater: bodyWater ? parseFloat(bodyWater) : null,
        visceralFat: visceralFat ? parseInt(visceralFat) : null,
        basalMetab: basalMetab ? parseInt(basalMetab) : null,
        notes: notes || null,
      },
    })
    res.json({ scan })
  } catch (e: any) {
    res.status(500).json({ error: "Kunne ikke lagre kroppsanalyse" })
  }
})

// ── InBody scan: list ────────────────────────────────────────────
router.get("/inbody", async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "Ikke autentisert" })

  try {
    const scans = await prisma.inBodyScan.findMany({
      where: { userId },
      orderBy: { scanDate: "desc" },
    })
    res.json({ scans })
  } catch {
    res.status(500).json({ error: "Kunne ikke hente kroppsanalyser" })
  }
})

// ── InBody scan: delete ──────────────────────────────────────────
router.delete("/inbody/:id", async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "Ikke autentisert" })

  try {
    const scan = await prisma.inBodyScan.findUnique({ where: { id: req.params.id } })
    if (!scan) return res.status(404).json({ error: "Ikke funnet" })
    if (scan.userId !== userId) return res.status(403).json({ error: "Ikke tilgang" })

    // Delete image file if exists
    if (scan.imageUrl) {
      const filePath = path.join(process.cwd(), scan.imageUrl)
      fs.unlink(filePath, () => {})
    }

    await prisma.inBodyScan.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: "Kunne ikke slette kroppsanalyse" })
  }
})

export default router
