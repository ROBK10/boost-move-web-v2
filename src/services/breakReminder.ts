// src/services/breakReminder.ts
// Sittepause-påminnelser — kjører som frontend-timer med Notification API

const STORAGE_KEY = "bm-break-reminder"
const INTERVAL_KEY = "bm-break-interval"

let timerId: ReturnType<typeof setInterval> | null = null

export function isBreakReminderEnabled(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true"
}

export function getBreakInterval(): number {
  return Number(localStorage.getItem(INTERVAL_KEY)) || 45
}

export function setBreakInterval(minutes: number) {
  localStorage.setItem(INTERVAL_KEY, String(minutes))
  if (isBreakReminderEnabled()) {
    stopBreakReminder()
    startBreakReminder()
  }
}

export function startBreakReminder() {
  localStorage.setItem(STORAGE_KEY, "true")
  stopBreakReminder()

  const intervalMs = getBreakInterval() * 60 * 1000

  timerId = setInterval(() => {
    showBreakNotification()
  }, intervalMs)
}

export function stopBreakReminder() {
  localStorage.setItem(STORAGE_KEY, "false")
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

function showBreakNotification() {
  if (!("Notification" in window)) return

  if (Notification.permission === "granted") {
    const tips = [
      "Reis deg og stå i 2 minutter — kroppen takker deg.",
      "Rull skuldrene og strekk nakken — 30 sekunder holder.",
      "Hent et glass vann — stå mens du drikker det.",
      "Ta 3 dype pust og slipp skuldrene ned fra ørene.",
      "Stå opp og ta en kort gåtur — 1 minutt er nok.",
    ]
    const tip = tips[Math.floor(Math.random() * tips.length)]

    new Notification("Sittepause", {
      body: tip,
      icon: "/pwa-192x192.png",
      tag: "break-reminder",
    })
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission()
  }
}

// Auto-start hvis aktivert
export function initBreakReminder() {
  if (isBreakReminderEnabled()) {
    startBreakReminder()
  }
}
