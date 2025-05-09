import type { MenuTheme } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemStore = defineStore('system', () => {
  const theme = ref<MenuTheme>('dark')
  const collapsed = ref(false)

  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value
  }

  return { theme, toggleCollapsed, collapsed }
})
