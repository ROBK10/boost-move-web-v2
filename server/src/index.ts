import "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import authRouter from "./routes/auth"
import minHelseRoutes from "./routes/minhelse"
import boostsRoutes from "./routes/boosts"
import teamRoutes from "./routes/team"
import { attachUser } from "./middleware/attachUser"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
)

// ✅ gjør at req.user finnes for ALLE routes (minhelse inkludert)
app.use(attachUser)

// health check
app.get("/health", (_req, res) => {
  res.json({ ok: true })
})

// routes
app.use("/auth", authRouter)
app.use("/minhelse", minHelseRoutes)
app.use("/boosts", boostsRoutes)
app.use("/team", teamRoutes)

const port = Number(process.env.PORT || 3001)

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`)
})