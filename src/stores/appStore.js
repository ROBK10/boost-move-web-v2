import { defineStore } from 'pinia'

const LS_HEALTH = 'bm_health_score'
const LS_STREAK = 'bm_boost_streak'
const LS_LAST_BOOST_DATE = 'bm_last_boost_date'

function todayKey() {
  // YYYY-MM-DD
  return new Date().toISOString().slice(0, 10)
}

export const useAppStore = defineStore('app', {
  state: () => ({
    healthScore: 0,       // 0-100
    boostStreak: 0,       // dager på rad
    lastBoostDate: null,  // 'YYYY-MM-DD'
  }),

  actions: {
    loadFromStorage() {
      const hs = Number(localStorage.getItem(LS_HEALTH))
      this.healthScore = Number.isFinite(hs) ? hs : 0

      const st = Number(localStorage.getItem(LS_STREAK))
      this.boostStreak = Number.isFinite(st) ? st : 0

      const last = localStorage.getItem(LS_LAST_BOOST_DATE)
      this.lastBoostDate = last || null
    },

    setHealthScore(score) {
      const s = Math.max(0, Math.min(100, Number(score) || 0))
      this.healthScore = s
      localStorage.setItem(LS_HEALTH, String(s))
    },

    completeBoostToday() {
      const today = todayKey()
      const last = this.lastBoostDate

      // Hvis allerede gjort i dag -> gjør ingenting
      if (last === today) return

      // Hvis sist var i går -> streak++
      // Ellers -> reset til 1
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yKey = yesterday.toISOString().slice(0, 10)

      if (last === yKey) {
        this.boostStreak += 1
      } else {
        this.boostStreak = 1
      }

      this.lastBoostDate = today

      localStorage.setItem(LS_STREAK, String(this.boostStreak))
      localStorage.setItem(LS_LAST_BOOST_DATE, today)
    },
  },
})
