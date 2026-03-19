// src/data/helsekalkulatorData.ts
// Datakilde: Helsedirektoratet (NLOD)
// https://www.helsedirektoratet.no/forebygging-diagnose-og-behandling/forebygging-og-levevaner/fysisk-aktivitet/kalkulator-helseeffekter-av-fysisk-aktivitet

export type ActivityLevel = "inactive" | "partial" | "active" | "extra"

export const activityLevels: {
  key: ActivityLevel
  label: string
  description: string
  order: number
}[] = [
  { key: "inactive", label: "Fysisk inaktiv", description: "< 100 METmin/uke", order: 0 },
  { key: "partial", label: "Delvis aktiv", description: "5–20 min daglig", order: 1 },
  { key: "active", label: "Fysisk aktiv", description: "~150 min/uke", order: 2 },
  { key: "extra", label: "Ekstra aktiv", description: "> 900 METmin/uke", order: 3 },
]

export function getActivityOrder(level: ActivityLevel): number {
  return activityLevels.find((a) => a.key === level)!.order
}

// DALY per person (livsløp) ved overgang fra inaktiv → delvis aktiv
export const dalyByAge: { key: string; label: string; dalyGain: number }[] = [
  { key: "20-29", label: "20–29 år", dalyGain: 7.85 },
  { key: "30-39", label: "30–39 år", dalyGain: 7.5 },
  { key: "40-49", label: "40–49 år", dalyGain: 7.4 },
  { key: "50-59", label: "50–59 år", dalyGain: 7.3 },
  { key: "60-69", label: "60–69 år", dalyGain: 6.86 },
  { key: "avg", label: "Gjennomsnitt", dalyGain: 6.48 },
]

// Multiplikator for DALY-gevinst relativt til inaktiv→delvis aktiv (baseline 1.0)
export const transitionMultipliers: Partial<Record<ActivityLevel, Partial<Record<ActivityLevel, number>>>> = {
  inactive: { partial: 1.0, active: 1.8, extra: 2.1 },
  partial: { active: 0.9, extra: 1.2 },
  active: { extra: 0.4 },
}

export function getMultiplier(from: ActivityLevel, to: ActivityLevel): number {
  return transitionMultipliers[from]?.[to] ?? 0
}

// Økonomiske konstanter (2023-kroner)
export const DALY_VALUE_NOK = 1_680_000
export const HEALTHCARE_SHARE = 0.18
export const WORKING_LIFE_YEARS = 40
