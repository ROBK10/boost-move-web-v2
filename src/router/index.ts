import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
import { useAuthStore } from "@/stores/authStore"

import Hjem from "@/views/Hjem.vue"
import MovinLayout from "@/views/MovinLayout.vue"
import MovinHome from "@/views/Movin.vue"
import MinHelse from "@/views/MinHelse.vue"
import Chat from "@/views/Chat.vue"
import Profil from "@/views/Profil.vue"
import ProfileSettings from "@/views/profile/ProfileSettings.vue"
import ProfilePersonal from "@/views/profile/ProfilePersonal.vue"
import ProfilePrivacy from "@/views/profile/ProfilePrivacy.vue"
import MinSituasjon from "@/views/profile/MinSituasjon.vue"
import Progresjon from "@/views/Progresjon.vue"
import Login from "@/views/Login.vue"

import BoostMoment from "@/views/movin/BoostMoment.vue"
import KomIGang from "@/views/movin/KomIGang.vue"
import KomIGangDetail from "@/views/movin/KomIGangDetail.vue"
import KnowZone from "@/views/movin/KnowZone.vue"
import KnowZoneDetail from "@/views/movin/KnowZoneDetail.vue"
import Programmer from "@/views/movin/Programmer.vue"
import ProgrammerDetail from "@/views/movin/ProgrammerDetail.vue"
import Maler from "@/views/movin/Maler.vue"
import MalerDetail from "@/views/movin/MalerDetail.vue"
import Fordeler from "@/views/movin/Fordeler.vue"
import FordelerDetail from "@/views/movin/FordelerDetail.vue"
import AdminPanel from "@/views/Admin.vue"
import Helsekalkulator from "@/views/Helsekalkulator.vue"

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/hjem" },
  { path: "/login", component: Login },
  { path: "/admin", component: AdminPanel },

  { path: "/hjem", component: Hjem },
  { path: "/min-helse", component: MinHelse },
  { path: "/chat", component: Chat },
  { path: "/profil", component: Profil },
  { path: "/profil/innstillinger", component: ProfileSettings },
  { path: "/profil/personlige-detaljer", component: ProfilePersonal },
  { path: "/profil/personvern", component: ProfilePrivacy },
  { path: "/profil/min-situasjon", component: MinSituasjon },
  { path: "/progresjon", component: Progresjon },
  { path: "/helsekalkulator", component: Helsekalkulator },

  {
    path: "/movin",
    component: MovinLayout,
    children: [
      { path: "", component: MovinHome },
      { path: "boost-moment", component: BoostMoment },
      { path: "kom-i-gang", component: KomIGang },
      { path: "kom-i-gang/:slug", component: KomIGangDetail },
      { path: "knowzone", component: KnowZone },
      { path: "knowzone/:slug", component: KnowZoneDetail },
      { path: "programmer", component: Programmer },
      { path: "programmer/:slug", component: ProgrammerDetail },
      { path: "maler", component: Maler },
      { path: "maler/:slug", component: MalerDetail },
      { path: "fordeler", component: Fordeler },
      { path: "fordeler/:slug", component: FordelerDetail },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ Auth guard
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Admin-panel krever admin-rolle
  if (to.path.startsWith("/admin")) {
    if (!auth.user && !auth.isLoading) {
      await auth.me()
    }
    if (!auth.isAuthed) return "/login"
    if (auth.user?.role !== "admin") return "/hjem"
    return true
  }

  // Tillat alltid login-siden
  if (to.path === "/login") {
    // Hvis vi allerede er innlogget, send til hjem
    if (!auth.user && !auth.isLoading) {
      await auth.me()
    }
    if (auth.isAuthed) return "/hjem"
    return true
  }

  // Prøv å hente bruker én gang hvis vi ikke vet ennå
  if (!auth.user && !auth.isLoading) {
    await auth.me()
  }

  // Hvis ikke authed -> send til login
  if (!auth.isAuthed) {
    return "/login"
  }

  return true
})

export default router
