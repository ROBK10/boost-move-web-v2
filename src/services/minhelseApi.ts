import { apiFetch } from "./api"

export type DailyCheckInInput = {
  movement: string   // bevegelse: ingen/lett/moderat/aktiv
  body: string       // stillesitting: ingen_pauser/noen/regelmessig
  energy: string     // søvn: under_5/5_6/7_8/over_8
  context: string    // kosthold: ingen/1_2/3_4/5_pluss
  mental: string     // stress: hoyt/middels/lavt
  workplace?: string // kontekst: kontor/hjemme/felt
}

export type DailyCheckIn = {
  id: string
  userId: string
  date: string
  movement: string
  body: string
  energy: string
  context: string
  mental: string | null
  capacityScore: number
  createdAt: string
  updatedAt?: string
}

export async function saveCheckIn(input: DailyCheckInInput): Promise<{ checkin: DailyCheckIn }> {
  return apiFetch("/minhelse/checkin", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function getTodayCheckIn(): Promise<{ checkin: DailyCheckIn | null }> {
  return apiFetch("/minhelse/today")
}

export async function getMonthCheckins(month: string): Promise<{ month: string; checkins: DailyCheckIn[]; streak: number; bestStreak: number }> {
  return apiFetch(`/minhelse/month?month=${encodeURIComponent(month)}`)
}
