import { defineStore } from "pinia"
import { storageService } from "@/services/storageService"

export type MovementInput = {
  raw: number
  interpretedAs: "minutes" | "steps"
  minutes?: number
  steps?: number
}

export type Draft = {
  sleepHours: number | null
  foodQuality: number | null // 1-10
  trainingMinutes: number | null
  weightKg: number | null
  movementRaw: number | null // <300=min, >=300=steps
}

export type DailyEntry = {
  date: string // YYYY-MM-DD
  sleepHours?: number
  foodQuality?: number
  trainingMinutes?: number
  weightKg?: number
  movement?: MovementInput

  totalScore: number // 0-100
  color: "Rød" | "Gul" | "Grønn"
  breakdown: {
    sleep: number
    movement: number
    training: number
    food: number
    weight: number
  }
}

const LS_KEY = "boostmove:minHelse:v1"

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function dateISOFromParts(year: number, month0: number, day: number) {
  return `${year}-${pad2(month0 + 1)}-${pad2(day)}`
}

export function todayISO(d = new Date()) {
  return dateISOFromParts(d.getFullYear(), d.getMonth(), d.getDate())
}

function daysInMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}

function safeParse<T>(s: string | null): T | null {
  if (!s) return null
  try {
    return JSON.parse(s) as T
  } catch {
    return null
  }
}

export function normalizeMovement(raw: unknown): MovementInput | undefined {
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0) return undefined

  // NB: din regel
  if (n < 300) return { raw: n, interpretedAs: "minutes", minutes: n }
  return { raw: n, interpretedAs: "steps", steps: n }
}

function scoreColor(total: number): DailyEntry["color"] {
  if (total >= 75) return "Grønn"
  if (total >= 50) return "Gul"
  return "Rød"
}

// --- Scoring (V1) ---
function sleepPoints(h?: number) {
  if (h == null) return 0
  if (h >= 7 && h <= 9) return 25
  if ((h >= 6 && h < 7) || (h > 9 && h <= 10)) return 18
  if ((h >= 5 && h < 6) || (h > 10 && h <= 11)) return 10
  return 0
}

function movementPoints(m?: MovementInput) {
  if (!m) return 0
  if (m.interpretedAs === "minutes") {
    const v = m.minutes ?? 0
    if (v >= 45) return 25
    if (v >= 30) return 18
    if (v >= 15) return 10
    return 0
  } else {
    const v = m.steps ?? 0
    if (v >= 8000) return 25
    if (v >= 6000) return 18
    if (v >= 4000) return 10
    return 0
  }
}

function trainingPoints(min?: number) {
  if (min == null) return 0
  if (min >= 30) return 20
  if (min >= 20) return 15
  if (min >= 10) return 8
  return 0
}

function foodPoints(q?: number) {
  if (q == null) return 0
  const clamped = Math.min(10, Math.max(1, q))
  return Math.round((clamped / 10) * 15)
}

function weightPoints(kg?: number) {
  if (kg == null) return 0
  return 5
}

function computeScore(input: {
  sleepHours?: number
  foodQuality?: number
  trainingMinutes?: number
  weightKg?: number
  movement?: MovementInput
}) {
  const breakdown = {
    sleep: sleepPoints(input.sleepHours),
    movement: movementPoints(input.movement),
    training: trainingPoints(input.trainingMinutes),
    food: foodPoints(input.foodQuality),
    weight: weightPoints(input.weightKg),
  }

  const totalRaw =
    breakdown.sleep +
    breakdown.movement +
    breakdown.training +
    breakdown.food +
    breakdown.weight // max 90

  const totalScore = Math.round((totalRaw / 90) * 100)
  return { totalScore, breakdown, color: scoreColor(totalScore) }
}

type PersistedMinHelseV1 = {
  entriesByDate: Record<string, DailyEntry>
}

export const useMinHelseStore = defineStore("minHelse", {
  state: () => ({
    hydrated: false,
    draft: {
      sleepHours: null,
      foodQuality: null,
      trainingMinutes: null,
      weightKg: null,
      movementRaw: null,
    } as Draft,

    entriesByDate: {} as Record<string, DailyEntry>,
  }),

  getters: {
    entriesList(state): DailyEntry[] {
      return Object.values(state.entriesByDate).sort((a, b) =>
        b.date.localeCompare(a.date)
      )
    },

    todayEntry(state): DailyEntry | null {
      return state.entriesByDate[todayISO()] ?? null
    },

    todayScore(state) {
      const movement = normalizeMovement(state.draft.movementRaw)
      return computeScore({
        sleepHours: state.draft.sleepHours ?? undefined,
        foodQuality: state.draft.foodQuality ?? undefined,
        trainingMinutes: state.draft.trainingMinutes ?? undefined,
        weightKg: state.draft.weightKg ?? undefined,
        movement,
      })
    },

    latestScore(state): number {
      const list = Object.values(state.entriesByDate).sort((a, b) =>
        b.date.localeCompare(a.date)
      )
      return list[0]?.totalScore ?? 0
    },

    monthStatus(state) {
      const now = new Date()
      const y = now.getFullYear()
      const m0 = now.getMonth()
      const count = daysInMonth(now)

      return Array.from({ length: count }, (_, i) => {
        const day = i + 1
        const date = dateISOFromParts(y, m0, day)
        const tracked = !!state.entriesByDate[date]
        return { date, day, tracked }
      })
    },
  },

  actions: {
    hydrateFromLocalStorage() {
      if (this.hydrated) return

      const raw = storageService.getString(LS_KEY)
      const data = safeParse<PersistedMinHelseV1>(raw)

      if (data?.entriesByDate) this.entriesByDate = data.entriesByDate
      this.hydrated = true

      // Pre-fill draft fra dagens entry hvis finnes
      const e = this.entriesByDate[todayISO()]
      if (e) {
        this.draft.sleepHours = e.sleepHours ?? null
        this.draft.foodQuality = e.foodQuality ?? null
        this.draft.trainingMinutes = e.trainingMinutes ?? null
        this.draft.weightKg = e.weightKg ?? null

        if (e.movement?.interpretedAs === "minutes") {
          this.draft.movementRaw = e.movement.minutes ?? null
        } else if (e.movement?.interpretedAs === "steps") {
          this.draft.movementRaw = e.movement.steps ?? null
        }
      }
    },

    persistToLocalStorage() {
      const payload: PersistedMinHelseV1 = { entriesByDate: this.entriesByDate }
      storageService.setString(LS_KEY, JSON.stringify(payload))
    },

    saveToday(date = todayISO()) {
      const movement = normalizeMovement(this.draft.movementRaw)
      const score = computeScore({
        sleepHours: this.draft.sleepHours ?? undefined,
        foodQuality: this.draft.foodQuality ?? undefined,
        trainingMinutes: this.draft.trainingMinutes ?? undefined,
        weightKg: this.draft.weightKg ?? undefined,
        movement,
      })

      const entry: DailyEntry = {
        date,
        sleepHours: this.draft.sleepHours ?? undefined,
        foodQuality: this.draft.foodQuality ?? undefined,
        trainingMinutes: this.draft.trainingMinutes ?? undefined,
        weightKg: this.draft.weightKg ?? undefined,
        movement,
        totalScore: score.totalScore,
        breakdown: score.breakdown,
        color: score.color,
      }

      this.entriesByDate[date] = entry
      this.persistToLocalStorage()
    },
  },
})