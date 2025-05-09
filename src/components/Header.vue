<script lang="ts" setup>
  import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
  } from '@ant-design/icons-vue'
  import { useSystemStore } from '../store/system'
  const store = useSystemStore()
</script>

<template>
  <div class="w-full h-full flex items-center pl-4">
    <div @click="store.toggleCollapsed">
      <MenuUnfoldOutlined v-if="store.collapsed" />
      <MenuFoldOutlined v-else />
    </div>
  </div>
</template>

