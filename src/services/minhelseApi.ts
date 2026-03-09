import { apiFetch } from "./api"

export type DailyCheckInInput = {
  context: "kontor" | "felt" | "hjemme" | "trening" | "pa_farten"
  body: "tung" | "ok" | "lett"
  energy: "tom" | "stabil" | "på"
  movement: "nei" | "litt" | "ja"
}

export type DailyCheckIn = {
  id: string
  userId: string
  date: string
  context: DailyCheckInInput["context"]
  body: DailyCheckInInput["body"]
  energy: DailyCheckInInput["energy"]
  movement: DailyCheckInInput["movement"]
  capacityScore: number
  createdAt: string
  updatedAt?: string
}

export type BoostResponse = {
  band: "low" | "stable" | "high"
  title: string
  message: string
  suggestions: string[]
}

export async function saveCheckIn(input: DailyCheckInInput): Promise<{ checkin: DailyCheckIn; boost: BoostResponse }> {
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
