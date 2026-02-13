import { createRouter, createWebHistory } from 'vue-router'

import Movin from '../views/Movin.vue'
import MinHelse from '../views/MinHelse.vue'
import Chat from '../views/Chat.vue'
import Profil from '../views/Profil.vue'
import Login from '../views/Login.vue'
import BoostMoment from '../views/movin/BoostMoment.vue'
import KomIGang from '../views/movin/KomIGang.vue'
import Programmer from '../views/movin/Programmer.vue'
import KnowZone from '../views/movin/KnowZone.vue'
import Maler from '../views/movin/Maler.vue'
import Fordeler from '../views/movin/Fordeler.vue'

const routes = [
  { path: '/movin/boost-moment', component: BoostMoment },
{ path: '/movin/kom-i-gang', component: KomIGang },
{ path: '/movin/programmer', component: Programmer },
{ path: '/movin/knowzone', component: KnowZone },
{ path: '/movin/maler', component: Maler },
{ path: '/movin/fordeler', component: Fordeler },
  { path: '/', redirect: '/movin' },

  { path: '/login', component: Login },
  { path: '/movin', component: Movin },
  { path: '/min-helse', component: MinHelse },
  { path: '/chat', component: Chat },
  { path: '/profil', component: Profil },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router