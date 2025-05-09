import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '../views/layout/index.vue'
import Dashboard from '../views/dashboard/index.vue'
import Users from '../views/users/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path:'users',
        component: Users
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
