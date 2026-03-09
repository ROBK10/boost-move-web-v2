// src/stores/boostStore.ts
import { defineStore } from "pinia"
import { apiFetch } from "@/services/api"

function toMonthKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

type MonthResponse = {
  month: string
  total: number
  byType: Record<string, number>
}

export const useBoostStore = defineStore("boost", {
  state: () => ({
    monthKey: toMonthKey(new Date()),
    monthTotal: 0,
    byType: {} as Record<string, number>,
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchMonthBoosts(month: string) {
      this.isLoading = true
      this.error = null

      try {
        const data = (await apiFetch(
          `/boosts/month?month=${encodeURIComponent(month)}`
        )) as MonthResponse

        this.monthKey = data.month
        this.monthTotal = data.total
        this.byType = data.byType

        return data
      } catch (e: any) {
        this.error = e?.message || "Kunne ikke hente boost-data"
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async completeBoost(type: string, durationSeconds: number) {
      this.isLoading = true
      this.error = null

      try {
        const res = (await apiFetch("/boosts/complete", {
          method: "POST",
          body: JSON.stringify({ type, durationSeconds }),
        })) as { session: { id: string; type: string; durationSeconds: number; completedAt: string } }

        await this.fetchMonthBoosts(this.monthKey)
        return res
      } catch (e: any) {
        this.error = e?.message || "Kunne ikke registrere boost"
        throw e
      } finally {
        this.isLoading = false
      }
    },
  },
})
