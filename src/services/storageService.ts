export const storageService = {
  getString(key: string): string | null {
    return localStorage.getItem(key)
  },

  setString(key: string, value: string) {
    localStorage.setItem(key, value)
  },

  getNumber(key: string, fallback = 0): number {
    const raw = localStorage.getItem(key)
    const n = raw === null ? NaN : Number(raw)
    return Number.isFinite(n) ? n : fallback
  },

  remove(key: string) {
    localStorage.removeItem(key)
  },
}