import { defineStore } from 'pinia'
import { storageService } from '@/services/storageService'

const LS_HEALTH = 'bm_health_score'
const LS_STREAK = 'bm_boost_streak'
const LS_LAST_BOOST_DATE = 'bm_last_boost_date'

type DateKey = `${number}-${number}-${number}`

function todayKey(): DateKey {
  return new Date().toISOString().slice(0, 10) as DateKey
}

function yesterdayKey(): DateKey {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10) as DateKey
}

interface AppState {
  healthScore: number        // 0-100
  boostStreak: number        // dager på rad
  lastBoostDate: DateKey | null
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    healthScore: 0,
    boostStreak: 0,
    lastBoostDate: null,
  }),

  actions: {
    loadFromStorage() {
      this.healthScore = storageService.getNumber(LS_HEALTH, 0)
      this.boostStreak = storageService.getNumber(LS_STREAK, 0)
      this.lastBoostDate = storageService.getString(LS_LAST_BOOST_DATE) as DateKey | null
    },

    setHealthScore(score: number) {
      const s = Math.max(0, Math.min(100, Number(score) || 0))
      this.healthScore = s
      storageService.setString(LS_HEALTH, String(s))
    },

    completeBoostToday() {
      const today = todayKey()
      const last = this.lastBoostDate

      if (last === today) return

      const yKey = yesterdayKey()

      this.boostStreak = last === yKey ? this.boostStreak + 1 : 1
      this.lastBoostDate = today

      storageService.setString(LS_STREAK, String(this.boostStreak))
      storageService.setString(LS_LAST_BOOST_DATE, today)
    },
  },
})