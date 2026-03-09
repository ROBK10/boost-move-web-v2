// src/stores/teamStore.ts
import { defineStore } from "pinia"
import { apiFetch } from "@/services/api"

type Trend = "up" | "down" | "stable"

export const useTeamStore = defineStore("team", {
  state: () => ({
    avgScore: null as number | null,
    trend: "stable" as Trend,
    participantCount: 0,

    available: false,
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchTeamStatus() {
      this.isLoading = true
      this.error = null

      try {
        const data = await apiFetch("/team/status")

        if (!data.available) {
          this.available = false
          return
        }

        this.available = true
        this.avgScore = data.avgScore
        this.trend = data.trend
        this.participantCount = data.participantCount
      } catch (err: any) {
        this.error = err?.message || "Failed to fetch team status"
      } finally {
        this.isLoading = false
      }
    },
  },
})