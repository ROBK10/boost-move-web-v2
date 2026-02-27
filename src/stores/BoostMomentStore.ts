import { defineStore } from 'pinia'
import { storageService } from '@/services/storageService'

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

interface BoostMomentState {
  hydrated: boolean
  boostStreak: number
  lastBoostDate: DateKey | null
}

export const useBoostMomentStore = defineStore('boostMoment', {
  state: (): BoostMomentState => ({
    hydrated: false,
    boostStreak: 0,
    lastBoostDate: null,
  }),

  actions: {
    hydrate() {
      if (this.hydrated) return
      this.boostStreak = storageService.getNumber(LS_STREAK, 0)
      this.lastBoostDate = storageService.getString(LS_LAST_BOOST_DATE) as DateKey | null
      this.hydrated = true
    },

    completeBoostToday() {
      if (!this.hydrated) this.hydrate()

      const today = todayKey()
      const last = this.lastBoostDate

      // allerede gjort i dag
      if (last === today) return

      const yKey = yesterdayKey()
      this.boostStreak = last === yKey ? this.boostStreak + 1 : 1
      this.lastBoostDate = today

      storageService.setString(LS_STREAK, String(this.boostStreak))
      storageService.setString(LS_LAST_BOOST_DATE, today)
    },

    reset() {
      this.boostStreak = 0
      this.lastBoostDate = null
      storageService.remove(LS_STREAK)
      storageService.remove(LS_LAST_BOOST_DATE)
    },
  },
})