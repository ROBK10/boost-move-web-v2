import { Router } from "express"
import { prisma } from "../db"
import { requireAuth } from "../middleware/requireAuth"

const router = Router()

function getUserId(req: any): string {
  if (req.user?.id) return req.user.id
  throw new Error("Not authenticated")
}

// GET /messages — fetch last 100 group messages for the user's workplace
router.get("/messages", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true },
    })

    if (!user) return res.status(401).json({ error: "User not found" })

    const messages = await prisma.message.findMany({
      where: { companyId: user.companyId },
      orderBy: { createdAt: "asc" },
      take: 100,
      include: { user: { select: { id: true, name: true } } },
    })

    return res.json(
      messages.map((m) => ({
        id: m.id,
        userId: m.userId,
        name: m.user.name,
        text: m.text,
        createdAt: m.createdAt.toISOString(),
      }))
    )
  } catch (err: any) {
    if (err?.message === "Not authenticated") return res.status(401).json({ error: "Not authenticated" })
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

// POST /messages — send a group message
router.post("/messages", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)
    const { text } = req.body

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "text is required" })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true, name: true },
    })

    if (!user) return res.status(401).json({ error: "User not found" })

    const message = await prisma.message.create({
      data: {
        userId,
        companyId: user.companyId,
        text: text.trim(),
      },
    })

    return res.status(201).json({
      id: message.id,
      userId: message.userId,
      name: user.name,
      text: message.text,
      createdAt: message.createdAt.toISOString(),
    })
  } catch (err: any) {
    if (err?.message === "Not authenticated") return res.status(401).json({ error: "Not authenticated" })
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

// GET /workplace-members — list colleagues in the same company (excluding self)
router.get("/workplace-members", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true },
    })

    if (!user) return res.status(401).json({ error: "User not found" })

    const members = await prisma.user.findMany({
      where: {
        companyId: user.companyId,
        id: { not: userId },
      },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    })

    return res.json(members)
  } catch (err: any) {
    if (err?.message === "Not authenticated") return res.status(401).json({ error: "Not authenticated" })
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

// GET /direct-messages?userA=&userB= — fetch DMs between two users
router.get("/direct-messages", requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req)
    const { userA, userB } = req.query

    // Reject if params are missing or not plain strings (guards against ?userA[]=...)
    if (typeof userA !== "string" || typeof userB !== "string" || !userA || !userB) {
      return res.status(400).json({ error: "userA and userB are required" })
    }

    // Security: requesting user must be one of the two parties
    if (userId !== userA && userId !== userB) {
      return res.status(403).json({ error: "Forbidden" })
    }

    const messages = await prisma.directMessage.findMany({
      where: {
        OR: [
          { senderId: userA, receiverId: userB },
          { senderId: userB, receiverId: userA },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 100,
      include: { sender: { select: { name: true } } },
    })

    return res.json(
      messages.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        senderName: m.sender.name,
        receiverId: m.receiverId,
        text: m.text,
        createdAt: m.createdAt.toISOString(),
      }))
    )
  } catch (err: any) {
    if (err?.message === "Not authenticated") return res.status(401).json({ error: "Not authenticated" })
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

// POST /direct-messages — send a DM
router.post("/direct-messages", requireAuth, async (req, res) => {
  try {
    const senderId = getUserId(req)
    const { receiverId, text } = req.body

    if (!receiverId || typeof receiverId !== "string") {
      return res.status(400).json({ error: "receiverId is required" })
    }
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "text is required" })
    }

    // Prevent self-messaging
    if (receiverId === senderId) {
      return res.status(400).json({ error: "Cannot send a message to yourself" })
    }

    // Look up sender and receiver in parallel; enforce same-company constraint
    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId }, select: { name: true, companyId: true } }),
      prisma.user.findUnique({ where: { id: receiverId }, select: { companyId: true } }),
    ])

    if (!sender) return res.status(401).json({ error: "User not found" })
    if (!receiver) return res.status(400).json({ error: "Recipient not found" })
    if (sender.companyId !== receiver.companyId) return res.status(403).json({ error: "Forbidden" })

    const message = await prisma.directMessage.create({
      data: { senderId, receiverId, text: text.trim() },
    })

    return res.status(201).json({
      id: message.id,
      senderId: message.senderId,
      senderName: sender.name,
      receiverId: message.receiverId,
      text: message.text,
      createdAt: message.createdAt.toISOString(),
    })
  } catch (err: any) {
    if (err?.message === "Not authenticated") return res.status(401).json({ error: "Not authenticated" })
    return res.status(500).json({ error: err?.message || "Server error" })
  }
})

export default router
