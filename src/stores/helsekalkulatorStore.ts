// src/stores/helsekalkulatorStore.ts
import { defineStore } from "pinia"
import {
  type ActivityLevel,
  dalyByAge,
  getMultiplier,
  getActivityOrder,
  DALY_VALUE_NOK,
  HEALTHCARE_SHARE,
  WORKING_LIFE_YEARS,
} from "@/data/helsekalkulatorData"

const nok = new Intl.NumberFormat("nb-NO", {
  style: "decimal",
  maximumFractionDigits: 0,
})

export const useHelsekalkulatorStore = defineStore("helsekalkulator", {
  state: () => ({
    employeeCount: 50,
    ageGroupKey: "avg" as string,
    currentLevel: "inactive" as ActivityLevel,
    targetLevel: "active" as ActivityLevel,
  }),

  getters: {
    baseDalyPerPerson(state): number {
      const ag = dalyByAge.find((a) => a.key === state.ageGroupKey)
      return ag?.dalyGain ?? 6.48
    },

    multiplier(state): number {
      return getMultiplier(state.currentLevel, state.targetLevel)
    },

    dalyPerPerson(): number {
      return this.baseDalyPerPerson * this.multiplier
    },

    totalDaly(state): number {
      return this.dalyPerPerson * state.employeeCount
    },

    totalSocietalValue(): number {
      return this.totalDaly * DALY_VALUE_NOK
    },

    healthcareSavings(): number {
      return this.totalSocietalValue * HEALTHCARE_SHARE
    },

    annualHealthcareSavings(): number {
      return this.healthcareSavings / WORKING_LIFE_YEARS
    },

    isValid(state): boolean {
      return (
        state.employeeCount > 0 &&
        getActivityOrder(state.targetLevel) > getActivityOrder(state.currentLevel)
      )
    },

    // Formaterte verdier for visning
    formatted(): {
      annualSavings: string
      totalDaly: string
      societalValue: string
    } {
      return {
        annualSavings: nok.format(Math.round(this.annualHealthcareSavings)),
        totalDaly: nok.format(Math.round(this.totalDaly * 10) / 10),
        societalValue: nok.format(Math.round(this.totalSocietalValue)),
      }
    },
  },

  actions: {
    setEmployees(n: number) {
      this.employeeCount = Math.max(1, n)
    },

    setCurrentLevel(level: ActivityLevel) {
      this.currentLevel = level
      if (getActivityOrder(this.targetLevel) <= getActivityOrder(level)) {
        const next = getActivityOrder(level) + 1
        const levels: ActivityLevel[] = ["inactive", "partial", "active", "extra"]
        this.targetLevel = levels[Math.min(next, 3)]
      }
    },

    setTargetLevel(level: ActivityLevel) {
      if (getActivityOrder(level) > getActivityOrder(this.currentLevel)) {
        this.targetLevel = level
      }
    },

    reset() {
      this.employeeCount = 50
      this.ageGroupKey = "avg"
      this.currentLevel = "inactive"
      this.targetLevel = "active"
    },
  },
})
