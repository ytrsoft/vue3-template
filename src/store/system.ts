import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSystemStore = defineStore('system', () => {

  const theme = ref<'light' | 'dark'>('light')
  const language = ref('zh-CN')
  const sidebarCollapsed = ref(false)

  const isDarkTheme = computed(() => theme.value === 'dark')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setLanguage = (lang: string) => {
    language.value = lang
  }

  return {
    theme,
    language,
    sidebarCollapsed,
    isDarkTheme,
    toggleTheme,
    setTheme,
    toggleSidebar,
    setLanguage
  }
})
