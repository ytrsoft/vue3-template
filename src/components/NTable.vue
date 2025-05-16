<script lang="ts" setup>
import type { VxeTableProps, Pager, NTableEmits, NTableProps } from '../types'
import type { VxeGridDefines, VxeGridListeners } from 'vxe-table'
import { ref, reactive, watch, onMounted, toRaw } from 'vue'

const props = withDefaults(defineProps<NTableProps>(), {
  immediate: true,
  checked: true
})

const emit = defineEmits<NTableEmits>()
const gridRef = ref()

const page = reactive<Pager>({
  pageSize: 10,
  currentPage: 1
})

const gridOptions = reactive<VxeTableProps>({
  columns: [],
  data: [],
  pagerConfig: {
    enabled: true,
    total: 0,
    get pageSize() {
      return page.pageSize
    },
    get currentPage() {
      return page.currentPage
    }
  }
})

watch(
  [() => props.data, () => props.columns],
  ([data, columns]) => {
    if (data) {
      gridOptions.data = data.result
      gridOptions.pagerConfig.total = data.total
    }
    if (columns) {
      gridOptions.columns = columns
      if (props.checked) {
        gridOptions.columns = [{
          type: 'checkbox',
          width: 90
        } as any].concat(gridOptions.columns)
      }
    }
  },
  { immediate: true }
)

const gridEvents: VxeGridListeners = {
  pageChange: (pager: Pager) => {
    Object.assign(page, pager)
    emit('change', toRaw(page))
  },
  checkboxAll: (checked: VxeGridDefines.CheckboxAllEventParams) => {
    emit('checked', checked.records.map(toRaw))
  },
  checkboxChange: (checked: VxeGridDefines.CheckboxChangeEventParams) => {
    emit('checked', checked.records.map(toRaw))
  }
}

onMounted(() => {
  if (props.immediate) {
    emit('change', toRaw(page))
  }
})

watch(page, () => {
  emit('change', toRaw(page))
}, { deep: true })
</script>

<template>
  <vxe-grid
    ref="gridRef"
    v-bind="gridOptions"
    v-on="gridEvents"
  />
</template>
