import "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
)

app.get("/health", (_req, res) => res.json({ ok: true }))

app.use("/auth", authRouter)

const port = Number(process.env.PORT || 3001)
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`)
})