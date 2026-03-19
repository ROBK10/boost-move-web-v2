import "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"

import authRouter from "./routes/auth"
import minHelseRoutes from "./routes/minhelse"
import boostsRoutes from "./routes/boosts"
import teamRoutes from "./routes/team"
import chatRoutes from "./routes/chat"
import userRoutes from "./routes/user"
import wishesRoutes from "./routes/wishes"
import adminRoutes from "./routes/admin"
import notificationRoutes from "./routes/notifications"
import { attachUser } from "./middleware/attachUser"

const app = express()

app.use(express.json())
app.use(cookieParser())

// Serve uploaded avatars as static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5176",
  "http://192.168.10.138:5173",
  "https://app.boostmove.no",
  "https://boost-move-web.vercel.app",
  process.env.CLIENT_ORIGIN,
].filter(Boolean) as string[]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
  })
)

// gjør at req.user finnes for ALLE routes
app.use(attachUser)

// health check
app.get("/health", (_req, res) => {
  res.json({ ok: true })
})

// routes
app.use("/auth", authRouter)
app.use("/user", userRoutes)
app.use("/minhelse", minHelseRoutes)
app.use("/boosts", boostsRoutes)
app.use("/team", teamRoutes)
app.use("/wishes", wishesRoutes)
app.use("/admin", adminRoutes)
app.use("/notifications", notificationRoutes)
app.use("/", chatRoutes)

const port = Number(process.env.PORT || 3001)

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`)
})