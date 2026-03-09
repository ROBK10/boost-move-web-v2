// src/stores/minHelseStore.ts
import { defineStore } from "pinia"
import { apiFetch } from "@/services/api"

export type Context = "felt" | "kontor" | "hjemme"

export type Draft = {
  sleepHours: number | null
  foodQuality: number | null
  trainingMinutes: number | null
  weightKg: number | null
  movementRaw: number | null
}

export type MinHelseCheckin = {
  id: string
  userId: string
  date: string // ISO
  capacityScore: number
  context: Context
  createdAt: string
  updatedAt?: string
}

export type BoostResponse = {
  band: "low" | "stable" | "high"
  title: string
  message: string
  suggestions: string[]
}

type MonthResponse = {
  month: string
  checkins: MinHelseCheckin[]
  streak: number
  bestStreak: number
}

const LS_KEY = "boostmove:minHelse:draft:v1"

export function todayISO(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function normalizeMovement(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return undefined

  const rounded = Math.round(value)
  if (rounded >= 300) {
    return { raw: rounded, interpretedAs: "steps" as const, steps: rounded }
  }
  return { raw: rounded, interpretedAs: "minutes" as const, minutes: rounded }
}

function toMonthKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

// En veldig enkel capacityScore (V1). Bytt gjerne ut med din faktiske logikk.
function calcCapacityScore(d: Draft) {
  let score = 50

  if (d.sleepHours != null) score += clamp((d.sleepHours - 7) * 5, -20, 20)
  if (d.foodQuality != null) score += clamp((d.foodQuality - 5) * 3, -15, 15)
  if (d.trainingMinutes != null) score += clamp(d.trainingMinutes / 10, 0, 15)
  if (d.movementRaw != null) score += clamp(d.movementRaw / 1000, 0, 15)

  // vekt påvirker ikke score her (ofte mer sensitivt) – kan kobles på senere
  return clamp(Math.round(score), 0, 100)
}

export const useMinHelseStore = defineStore("minHelse", {
  state: () => ({
    // UI/draft (det brukeren fyller inn)
    draft: {
      sleepHours: null,
      foodQuality: null,
      trainingMinutes: null,
      weightKg: null,
      movementRaw: null,
    } as Draft,

    // “live” score brukt i UI
    latestScore: 0,
    todaysContext: "kontor" as Context,

    // server state
    lastCheckin: null as MinHelseCheckin | null,
    lastBoost: null as BoostResponse | null,

    monthKey: toMonthKey(new Date()),
    monthCheckins: [] as MinHelseCheckin[],
    streak: 0,
    bestStreak: 0,

    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    hydrateFromLocalStorage() {
      try {
        const raw = localStorage.getItem(LS_KEY)
        if (!raw) return
        const parsed = JSON.parse(raw)

        this.draft.sleepHours = typeof parsed.sleepHours === "number" ? parsed.sleepHours : null
        this.draft.foodQuality = typeof parsed.foodQuality === "number" ? parsed.foodQuality : null
        this.draft.trainingMinutes = typeof parsed.trainingMinutes === "number" ? parsed.trainingMinutes : null
        this.draft.weightKg = typeof parsed.weightKg === "number" ? parsed.weightKg : null
        this.draft.movementRaw = typeof parsed.movementRaw === "number" ? parsed.movementRaw : null

        // oppdater score basert på draft
        this.latestScore = calcCapacityScore(this.draft)
      } catch {
        // ignore
      }
    },

    persistDraft() {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(this.draft))
      } catch {
        // ignore
      }
    },

    // kall denne når draft endres (evt. via watcher i komponent)
    recalcScore() {
      this.latestScore = calcCapacityScore(this.draft)
      this.persistDraft()
    },

    async submitCheckin(payload?: { context?: Context; date?: string }) {
      this.isLoading = true
      this.error = null

      try {
        // V1: sender bare capacityScore + context + date
        const capacityScore = calcCapacityScore(this.draft)
        const context = payload?.context ?? this.todaysContext
        const date = payload?.date // "YYYY-MM-DD" valgfritt

        const res = (await apiFetch("/minhelse/checkin", {
          method: "POST",
          body: JSON.stringify({
            capacityScore,
            context,
            date,
          }),
        })) as { checkin: MinHelseCheckin; boost: BoostResponse }

        this.lastCheckin = res.checkin
        this.lastBoost = res.boost
        this.latestScore = res.checkin.capacityScore
        this.todaysContext = res.checkin.context

        // oppdater monthKey hvis innsjekken tilhører annen måned
        const checkinDate = new Date(res.checkin.date)
        const mk = toMonthKey(checkinDate)
        if (mk !== this.monthKey) this.monthKey = mk

        await this.fetchMonthCheckins(this.monthKey)
        return res
      } catch (e: any) {
        this.error = e?.message || "Kunne ikke lagre innsjekk"
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async fetchMonthCheckins(month: string) {
      this.isLoading = true
      this.error = null

      try {
        const data = (await apiFetch(
          `/minhelse/month?month=${encodeURIComponent(month)}`
        )) as MonthResponse

        this.monthKey = data.month
        this.monthCheckins = data.checkins
        this.streak = data.streak
        this.bestStreak = data.bestStreak

        return data
      } catch (e: any) {
        this.error = e?.message || "Kunne ikke hente måned"
        throw e
      } finally {
        this.isLoading = false
      }
    },
  },
})
