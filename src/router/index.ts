import { head } from 'lodash'
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '../views/layout/index.vue'
import Icon from '../views/icon/index.vue'
import Form from '../views/form/index.vue'
import Grag from '../views/drag/index.vue'
import Command from '../views/command/index.vue'
import Mock from '../views/mock/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        redirect: '/icon'
      },
      {
        path: '/mock',
        component: Mock,
        meta: {
          title: 'Mock'
        }
      },
      {
        path: '/icon',
        component: Icon,
        meta: {
          title: 'SVG图标'
        }
      },
      {
        path:'/drag',
        component: Grag,
        meta: {
          title: '拖拽卡顿'
        }
      },
      {
        path:'/form',
        component: Form,
        meta: {
          title: '动态表单'
        }
      },
      {
        path:'/command',
        component: Command,
        meta: {
          title: '命令式组件'
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
