import { createRouter, createWebHistory } from 'vue-router'

import Hjem from '@/views/Hjem.vue'
import MovinLayout from '@/views/MovinLayout.vue'
import MovinHome from '@/views/Movin.vue'
import MinHelse from '@/views/MinHelse.vue'
import Chat from '@/views/Chat.vue'
import Profil from '@/views/Profil.vue'
import Login from '@/views/Login.vue'

import BoostMoment from '@/views/movin/BoostMoment.vue'
import KomIGang from '@/views/movin/KomIGang.vue'
import Programmer from '@/views/movin/Programmer.vue'
import KnowZone from '@/views/movin/KnowZone.vue'
import Maler from '@/views/movin/Maler.vue'
import Fordeler from '@/views/movin/Fordeler.vue'

const routes = [
  { path: '/', redirect: '/hjem' },
  { path: '/hjem', component: Hjem },
  { path: '/login', component: Login },
  { path: '/min-helse', component: MinHelse },
  { path: '/chat', component: Chat },
  { path: '/profil', component: Profil },

  {
    path: '/movin',
    component: MovinLayout,
    children: [
      { path: '', component: MovinHome }, // /movin viser tiles
      { path: 'boost-moment', component: BoostMoment },
      { path: 'kom-i-gang', component: KomIGang },
      { path: 'programmer', component: Programmer },
      { path: 'knowzone', component: KnowZone },
      { path: 'maler', component: Maler },
      { path: 'fordeler', component: Fordeler },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router