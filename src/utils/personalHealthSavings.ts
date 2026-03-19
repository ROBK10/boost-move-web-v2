// src/utils/personalHealthSavings.ts
// Beregner personlig aktivitetsnivå og helsegevinst fra Min Helse-data
// Datakilde: Helsedirektoratet (NLOD)

import { type ActivityLevel } from "@/data/helsekalkulatorData"

export type CheckinData = { body: string; movement: string }

// ── Minutt-estimater per innsjekk-verdi ────────────────────────────────────

const MOVEMENT_MINUTES_MAP: Record<string, number> = {
  ingen: 0, lett: 15, moderat: 40, aktiv: 70,
  under_30: 10, "30_60": 40, over_60: 70,
  ja: 45, litt: 20, nei: 0,
}

const BOOST_MINUTES = 5

// ── Daglig helsegevinst (kr/dag basert på daglig aktivitetsnivå) ───────────
// Basert på Helsedirektoratets DALY-modell, skalert til dagsnivå

const DAILY_RATE: Record<ActivityLevel, number> = {
  inactive: 0,
  partial: 200,
  active: 360,
  extra: 420,
}

const ACTIVITY_LABEL: Record<ActivityLevel, string> = {
  inactive: "Inaktiv",
  partial: "Delvis aktiv",
  active: "Aktiv",
  extra: "Over mål",
}

// ── Beregningsfunksjoner ───────────────────────────────────────────────────

/** Estimerte aktive minutter for én dag */
export function estimateDailyMinutes(checkin: CheckinData): number {
  const mov = checkin.movement
  // V4: movement er et tall som streng (f.eks. "30")
  const parsed = parseInt(mov)
  if (!isNaN(parsed) && parsed >= 0) return parsed
  // V1-V3: movement er en nøkkel (f.eks. "lett", "moderat")
  return MOVEMENT_MINUTES_MAP[mov] ?? 0
}

/** Sum aktive minutter for siste 7 dager (+ boost-bonus) */
export function weeklyMinutesFromCheckins(checkins: CheckinData[], boostCount: number = 0): number {
  if (checkins.length === 0) return boostCount * BOOST_MINUTES

  let total = 0
  for (const c of checkins) {
    total += estimateDailyMinutes(c)
  }

  const avgDaily = total / checkins.length
  const weekEstimate = checkins.length >= 7 ? total : Math.round(avgDaily * 7)

  return weekEstimate + boostCount * BOOST_MINUTES
}

/** Daglig aktivitetsnivå basert på dagens minutter vs daglig mål */
export function dailyActivityLevel(todayMinutes: number, weeklyGoal: number = 150): ActivityLevel {
  // Daglig mål = ukemål / 7 (men minimum 1 for å unngå div by zero)
  const dailyGoal = Math.max(weeklyGoal / 7, 1)
  const pct = todayMinutes / dailyGoal
  if (pct >= 1.5) return "extra"
  if (pct >= 0.8) return "active"
  if (pct > 0) return "partial"
  return "inactive"
}

/** Mapper ukentlige minutter til aktivitetsnivå RELATIVT til personlig mål */
export function activityLevelFromMinutes(weeklyMinutes: number, weeklyGoal: number = 150): ActivityLevel {
  if (weeklyGoal <= 0) return "inactive"
  const pct = weeklyMinutes / weeklyGoal
  if (pct >= 1.5) return "extra"
  if (pct >= 0.8) return "active"
  if (pct >= 0.3) return "partial"
  return "inactive"
}

/** Spirometer-farge: limegrønn for tracket dag, rød for ikke-tracket */
export function minuteColor(minutes: number): string {
  if (minutes <= 0) return "rgba(239, 68, 68, 0.7)"  // rød — ikke tracket
  return "#BEF201"                                     // limegrønn — tracket
}

/** Ringfarge basert på prosent av ukemål */
export function ringZoneColor(pct: number): string {
  if (pct <= 0) return "rgba(2, 50, 56, 0.12)"
  if (pct < 0.33) return "rgba(239, 68, 68, 0.85)"
  if (pct < 0.66) return "rgba(245, 158, 11, 0.85)"
  if (pct < 1.0) return "#BEF201"
  return "#BEF201"
}

/** Helsegevinst — beregner TOTAL akkumulert verdi (stopper aldri) */
export function personalSavings(
  checkins: CheckinData[],
  boostCount: number = 0,
  weeklyGoal: number = 150,
): {
  weeklyMinutes: number
  weeklyTarget: number
  weeklyPct: number
  todayLevel: ActivityLevel
  todayLabel: string
  totalSavings: number
  activityLevel: ActivityLevel
  activityLabel: string
  dailyRate: number
  monthlySavings: number
} {
  const weeklyMinutes = weeklyMinutesFromCheckins(checkins, boostCount)

  // Total akkumulert helsegevinst — hver dag med aktivitet teller
  let totalSavings = 0
  let todayMins = 0
  const todayKey = new Date().toISOString().slice(0, 10)

  for (const c of checkins) {
    const mins = estimateDailyMinutes(c)
    const level = dailyActivityLevel(mins, weeklyGoal)
    totalSavings += DAILY_RATE[level]

    // Sjekk om dette er dagens innsjekk
    const cDate = new Date(c.date ?? (c as any).createdAt).toISOString().slice(0, 10)
    if (cDate === todayKey) {
      todayMins = mins
    }
  }

  // Boost-bonus til total
  totalSavings += boostCount * 50

  // Dagens nivå
  const todayLevel = dailyActivityLevel(todayMins, weeklyGoal)

  // Ukentlig nivå (for bakoverkompatibilitet)
  const activityLevel = activityLevelFromMinutes(weeklyMinutes, weeklyGoal)

  return {
    weeklyMinutes,
    weeklyTarget: weeklyGoal,
    weeklyPct: weeklyGoal > 0 ? Math.min(weeklyMinutes / weeklyGoal, 1.5) : 0,
    todayLevel,
    todayLabel: ACTIVITY_LABEL[todayLevel],
    totalSavings,
    activityLevel,
    activityLabel: ACTIVITY_LABEL[activityLevel],
    dailyRate: DAILY_RATE[todayLevel],
    monthlySavings: totalSavings, // alias — total akkumulert
  }
}
