import { defineStore } from "pinia"
import { apiFetch, saveToken, clearToken } from "../services/api"
import { updateProfile as apiUpdateProfile, uploadAvatar as apiUploadAvatar } from "../services/userService"

export type AuthUser = {
  id: string
  email: string
  name: string
  role: string
  companyId: string
  companyName?: string
  bio?: string
  avatarUrl?: string
  onboardingDone?: boolean
  weeklyGoal?: number
  focusPillars?: string | null
  healthChallenge?: string | null
  biggestStruggle?: string | null
  motivation?: string | null
  notifyDaily?: boolean
  notifyTime?: string
}

type RegisterInput = {
  name: string
  email: string
  password: string
  companyName?: string
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as AuthUser | null,
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthed: (s) => !!s.user,
  },

  actions: {
    async me() {
      this.isLoading = true
      this.error = null
      try {
        const data = await apiFetch("/auth/me")
        this.user = data.user
      } catch {
        this.user = null
      } finally {
        this.isLoading = false
      }
    },

    async login(email: string, password: string) {
      this.isLoading = true
      this.error = null
      try {
        const data = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        })
        if (data.token) saveToken(data.token)
        this.user = data.user
      } catch (e: any) {
        this.error = e?.message || "Kunne ikke logge inn"
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async register(input: RegisterInput) {
      this.isLoading = true
      this.error = null
      try {
        const data = await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify(input),
        })
        if (data.token) saveToken(data.token)
        this.user = data.user
      } catch (e: any) {
        this.error = e?.message || "Kunne ikke registrere"
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      await apiFetch("/auth/logout", { method: "POST" }).catch(() => {})
      clearToken()
      this.user = null
    },

    async updateProfile(data: Record<string, any>) {
      const res = await apiUpdateProfile(data)
      if (this.user && res.user) {
        Object.assign(this.user, res.user)
      }
    },

    async uploadAvatar(file: File) {
      const res = await apiUploadAvatar(file)
      if (this.user) {
        this.user.avatarUrl = res.avatarUrl
      }
      return res.avatarUrl
    },
  },
})