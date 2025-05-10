<script lang="ts" setup>
  import { useGet } from '../../hook'
  const { data } = useGet('/users')
</script>

<template>
  <h1>{{ data }}</h1>
</template>
