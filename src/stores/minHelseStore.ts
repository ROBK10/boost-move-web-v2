// src/stores/minHelseStore.ts
import { defineStore } from "pinia"
import { apiFetch } from "@/services/api"

export type Context = "felt" | "kontor" | "hjemme"

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

function toMonthKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

export const useMinHelseStore = defineStore("minHelse", {
  state: () => ({
    latestScore: 0,
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
    async submitCheckin(payload: { context: Context; date?: string }) {
      this.isLoading = true
      this.error = null

      try {
        const res = (await apiFetch("/minhelse/checkin", {
          method: "POST",
          body: JSON.stringify({
            context: payload.context,
            date: payload.date,
          }),
        })) as { checkin: MinHelseCheckin; boost: BoostResponse }

        this.lastCheckin = res.checkin
        this.lastBoost = res.boost
        this.latestScore = res.checkin.capacityScore

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
