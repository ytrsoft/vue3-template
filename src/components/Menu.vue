<script lang="ts" setup>
import { getDefault, getMenu } from '../router'
import { useSystemStore } from '../store/system'
import {
  UnorderedListOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const store = useSystemStore()

const keys = ref(getDefault())

const items = computed(() => {
  return getMenu()?.map((r) => {
    return {
      key: r.path,
      title: r.path,
      icon: () => h(UnorderedListOutlined),
      label: r?.meta?.title
    }
  })
})

const style = computed(() => {
  return {
    width: store.collapsed ? '40px' : '220px'
  }
})

const handleMenuClick = ({ key, selectedKeys }: any) => {
  keys.value = selectedKeys
  router.push(key)
}
</script>

<template>
  <AMenu
    mode="inline"
    :style="style"
    :theme="store.theme"
    :selected-keys="keys"
    :inline-collapsed="store.collapsed"
    :items="items"
    @select="handleMenuClick"
  />
</template>

