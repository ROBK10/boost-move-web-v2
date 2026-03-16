import { Router } from "express"
import { prisma } from "../db"
import { requireAuth } from "../middleware/requireAuth"

const router = Router()

// POST /wishes — lagre tilbakemelding fra "Hva ønsker dere på jobb?"
router.post("/", requireAuth, async (req: any, res) => {
  try {
    const { month, selected, annetText } = req.body as {
      month?: string
      selected?: string[]
      annetText?: string
    }

    if (!month || !selected || !Array.isArray(selected) || selected.length === 0) {
      return res.status(400).json({ error: "month og selected er påkrevd" })
    }

    const wish = await prisma.workplaceWish.create({
      data: {
        companyId: req.user.companyId,
        month,
        selected,
        annetText: annetText || null,
      },
    })

    return res.json({ ok: true, id: wish.id })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
})

export default router
