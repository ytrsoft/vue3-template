<script lang="ts" setup>
  import type { Column, Pager, TableResponse } from '../../types'
  import { usePost } from '../../hook'
  const { data, retry } = usePost({
    url: '/users',
    immediate: false
  })
  interface User {
    name: string
    email: string
  }
  const columns: Column[] = [
    {
      field: 'name',
      title: '姓名'
    },
    {
      field: 'email',
      title: '邮件'
    }
  ]
  const handleChange = (page: Pager) => {
    console.log('page', page)
    retry(page)
  }
  const handleChecked = (data: User[]) => {
    console.log('checked', data)
  }
</script>

<template>
  <NTable
    :data="data as TableResponse<User>"
    :total="(data as any).total"
    :columns="columns"
    @change="handleChange"
    @checked="handleChecked"/>
</template>
