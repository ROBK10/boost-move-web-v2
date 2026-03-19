// src/utils/weeklyInsights.ts
// Genererer pilarbaserte ukentlige innsikter fra innsjekk-data

import { PILLAR_SCORES, type TipPillar } from "@/data/healthTips"

type CheckinData = {
  movement: string
  body: string
  energy: string
  context: string
  mental?: string | null
}

type PillarInsight = {
  pillar: TipPillar
  label: string
  avgScore: number    // 0–20
  pct: number         // 0–100
  lowDays: number
  totalDays: number
  message: string
  isStrong: boolean
}

const PILLAR_LABELS: Record<TipPillar, string> = {
  bevegelse: "Bevegelse",
  stillesitting: "Stillesitting",
  sovn: "Søvn",
  kosthold: "Kosthold",
  mental: "Mental helse",
}

const PILLAR_FIELD: Record<TipPillar, keyof CheckinData> = {
  bevegelse: "movement",
  stillesitting: "body",
  sovn: "energy",
  kosthold: "context",
  mental: "mental",
}

const LOW_THRESHOLD = 8 // under dette = "lav" for den pilaren

const WEAK_MESSAGES: Record<TipPillar, string[]> = {
  bevegelse: [
    "Bevegelse har vært lav {lowDays} av {total} dager. En 10-minutters gåtur daglig gjør stor forskjell.",
    "Du har hatt lite aktivitet denne uken. Prøv å ta trappa i stedet for heisen.",
  ],
  stillesitting: [
    "Du har sittet mye uten pauser {lowDays} av {total} dager. Prøv å reise deg hvert 30. minutt.",
    "Stillesitting er din svakeste pilar. Korte stå-pauser gjør mye for kroppen.",
  ],
  sovn: [
    "Søvnen har vært kort {lowDays} av {total} dager. Prøv å legge deg 30 min tidligere i kveld.",
    "Søvn trekker ned denne uken. Legg bort telefonen før sengetid — det hjelper.",
  ],
  kosthold: [
    "Du har spist lite frukt/grønt {lowDays} av {total} dager. Prøv å legge til én porsjon per dag.",
    "Kostholdet kan bli bedre. Start med en frukt til frokost — lavterskel og effektivt.",
  ],
  mental: [
    "Stressnivået har vært høyt {lowDays} av {total} dager. Ta 3 dype pust og kjenn roen bre seg.",
    "Mental helse trenger litt ekstra. Prøv en kort pause uten skjerm.",
  ],
}

const STRONG_MESSAGES: Record<TipPillar, string[]> = {
  bevegelse: ["Bevegelse er din sterkeste pilar denne uken — bra jobbet!"],
  stillesitting: ["Du tar regelmessige pauser fra sitting — det gjør kroppen din glad."],
  sovn: ["Søvnen din har vært god denne uken — hold rutinen!"],
  kosthold: ["Flott kosthold denne uken — du har fått inn nok frukt og grønt."],
  mental: ["Stressnivået har vært lavt — godt mentalt overskudd denne uken."],
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateWeeklyInsights(checkins: CheckinData[]): {
  weakest: PillarInsight | null
  strongest: PillarInsight | null
  allPillars: PillarInsight[]
} {
  if (checkins.length < 3) return { weakest: null, strongest: null, allPillars: [] }

  const pillars: TipPillar[] = ["bevegelse", "stillesitting", "sovn", "kosthold", "mental"]
  const results: PillarInsight[] = []

  for (const pillar of pillars) {
    const field = PILLAR_FIELD[pillar]
    const scoreMap = PILLAR_SCORES[pillar]
    let totalScore = 0
    let lowDays = 0

    for (const c of checkins) {
      const val = c[field] as string | undefined | null
      const score = val ? (scoreMap[val] ?? 10) : 10
      totalScore += score
      if (score < LOW_THRESHOLD) lowDays++
    }

    const avgScore = totalScore / checkins.length
    const pct = Math.round((avgScore / 20) * 100)
    const isStrong = avgScore >= 15
    const messages = isStrong ? STRONG_MESSAGES[pillar] : WEAK_MESSAGES[pillar]
    const message = pickRandom(messages)
      .replace("{lowDays}", String(lowDays))
      .replace("{total}", String(checkins.length))

    results.push({
      pillar,
      label: PILLAR_LABELS[pillar],
      avgScore,
      pct,
      lowDays,
      totalDays: checkins.length,
      message,
      isStrong,
    })
  }

  results.sort((a, b) => a.avgScore - b.avgScore)

  return {
    weakest: results[0],
    strongest: results[results.length - 1],
    allPillars: results,
  }
}
