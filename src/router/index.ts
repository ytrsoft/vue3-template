import { head } from 'lodash'
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
        path: '/dashboard',
        component: Dashboard,
        meta: {
          title: '首页'
        }
      },
      {
        path:'/users',
        component: Users,
        meta: {
          title: '用户管理'
        }
      }
    ]
  }
]

export const getMenu = () => {
  return head(routes)?.children?.filter((r) => r.path)
}

export const getDefault = () => {
  return [head(getMenu())?.path] as Array<string>
}

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
