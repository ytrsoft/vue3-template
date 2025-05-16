<script lang="ts" setup>
  import type {
    VxeTableProps,
    Pager,
    NTableEmits,
    NTableProps,
  } from '../types'
  import type { VxeGridListeners } from 'vxe-table'
  const props = withDefaults(defineProps<NTableProps>(), {
    immediate: true
  })
  const gridRef = ref()
  const page = reactive<Pager>({
    pageSize: 1,
    currentPage: 10
  })
  const emit = defineEmits<NTableEmits>()
  const gridOptions = reactive<VxeTableProps>({
    columns: [],
    data: [],
    pagerConfig: {
      enabled: true
    }
  })
  const setPageChange = (pager?: Pager) => {
    if (!page) {
      page.pageSize = pager.pageSize
      page.currentPage = pager.currentPage
    }
    gridOptions.data = props.data
    gridOptions.columns = props.columns
    emit('change', toRaw(page))
  }
  const gridEvents: VxeGridListeners = {
    pageChange({ currentPage, pageSize }) {
      setPageChange({ currentPage, pageSize })
    }
  }
  onMounted(() => {
    if (props.immediate) {
      emit('change', toRaw(page))
    }
    setPageChange()
  })
</script>

<template>
  <vxe-grid 
    ref="gridRef"
    v-bind="gridOptions"
    v-on="gridEvents" />
</template>

