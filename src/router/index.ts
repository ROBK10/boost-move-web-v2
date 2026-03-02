import { createRouter, createWebHistory } from "vue-router"

import Hjem from "@/views/Hjem.vue"
import MovinLayout from "@/views/MovinLayout.vue"
import MovinHome from "@/views/Movin.vue"
import MinHelse from "@/views/MinHelse.vue"
import Chat from "@/views/Chat.vue"
import Profil from "@/views/Profil.vue"
import Login from "@/views/Login.vue"

import BoostMoment from "@/views/movin/BoostMoment.vue"

import KomIGang from "@/views/movin/KomIGang.vue"
import KomIGangDetail from "@/views/movin/KomIGangDetail.vue"

import Programmer from "@/views/movin/Programmer.vue"
import ProgrammerDetail from "@/views/movin/ProgrammerDetail.vue"

import KnowZone from "@/views/movin/KnowZone.vue"
import KnowZoneDetail from "@/views/movin/KnowZoneDetail.vue"

import Maler from "@/views/movin/Maler.vue"
import MalerDetail from "@/views/movin/MalerDetail.vue"

import Fordeler from "@/views/movin/Fordeler.vue"
import FordelerDetail from "@/views/movin/FordelerDetail.vue"

const routes = [
  { path: "/", redirect: "/hjem" },
  { path: "/hjem", component: Hjem },
  { path: "/login", component: Login },
  { path: "/min-helse", component: MinHelse },
  { path: "/chat", component: Chat },
  { path: "/profil", component: Profil },

  {
    path: "/movin",
    component: MovinLayout,
    children: [
      { path: "", component: MovinHome },
      { path: "boost-moment", component: BoostMoment },

      { path: "kom-i-gang", component: KomIGang },
      { path: "kom-i-gang/:id", component: KomIGangDetail },

      { path: "programmer", component: Programmer },
      { path: "programmer/:id", component: ProgrammerDetail },

      { path: "knowzone", component: KnowZone },
      { path: "knowzone/:id", component: KnowZoneDetail },

      { path: "maler", component: Maler },
      { path: "maler/:id", component: MalerDetail },

      { path: "fordeler", component: Fordeler },
      { path: "fordeler/:id", component: FordelerDetail },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router