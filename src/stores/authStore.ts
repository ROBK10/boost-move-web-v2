import { defineStore } from "pinia"
import { apiFetch } from "@/services/api"

export type AuthUser = {
  id: string
  email: string
  name: string
  role: string
  companyId: string
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
      } catch (e: any) {
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
        this.user = data.user
      } catch (e: any) {
        this.error = e?.message || "Kunne ikke logge inn"
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async register(name: string, email: string, password: string, companyName?: string) {
      this.isLoading = true
      this.error = null
      try {
        const data = await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password, companyName }),
        })
        this.user = data.user
      } catch (e: any) {
        this.error = e?.message || "Kunne ikke registrere"
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      await apiFetch("/auth/logout", { method: "POST" })
      this.user = null
    },
  },
})