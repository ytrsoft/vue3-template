<script lang="ts" setup>
  
  import type {
    Column
  } from '../types'
  import { usePost } from '../../hook'

  const columns: Column[] = [
    {
      field: 'name',
      title: '姓名'
    }
  ]
  const data: any[] = [
    {
      name: 'jack'
    }
  ]
  const handleChange = (page) => {
    console.log('page change', page)
  }
</script>

<template>
  <NTable 
    :data="data"
    :columns="columns"
    @change="handleChange"/>
</template>
