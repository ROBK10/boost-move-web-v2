import { apiFetch } from "./api"

export type DailyCheckInInput = {
  context: "kontor" | "felt" | "hjemme" | "trening" | "pa_farten"
  body: "tung" | "ok" | "lett"
  energy: "tom" | "stabil" | "på"
  movement: "nei" | "litt" | "ja"
}

export async function saveCheckIn(input: DailyCheckInInput) {
  return apiFetch("/minhelse/checkin", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function getTodayCheckIn() {
  return apiFetch("/minhelse/today")
}
export async function getMonthCheckins(month: string) {
  return apiFetch(`/minhelse/month?month=${encodeURIComponent(month)}`)
}
