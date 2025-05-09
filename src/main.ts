import 'virtual:svg-icons-register'

import { createApp } from 'vue'

import { createPinia } from 'pinia'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxeUIPluginRenderAntd from '@vxe-ui/plugin-render-antd'
import '@vxe-ui/plugin-render-antd/dist/style.css'

import App from './App.vue'
import SvgIcon from './components/SvgIcon.vue'

import './style.css'

import { router } from './router'

VxeUI.use(VxeUIPluginRenderAntd)

const pinia = createPinia()

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(Antd)
app.use(VxeUI)
app.use(VxeUITable)

app.component('SvgIcon', SvgIcon)

app.mount('#app')
