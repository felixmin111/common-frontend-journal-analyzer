import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import WriteJournaling from '@/views/WriteJournaling.vue'
import DailyReport from '@/views/DailyReport.vue'
import MonthlyReport from '@/views/MonthlyReport.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/write' },
  { path: '/write', name: 'write', component: WriteJournaling },
  { path: '/daily', name: 'daily', component: DailyReport },
  { path: '/monthly', name: 'monthly', component: MonthlyReport },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
