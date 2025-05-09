<template>
  <div class="w-full flex gap-6 p-6">
    <div class="flex-[3] bg-white rounded-xl border shadow-lg p-4 transition-all duration-300">
      <h2 class="text-lg font-semibold mb-4">组织树</h2>
      <a-tree
        :tree-data="treeData"
        draggable
        block-node
        show-line
        :defaultExpandAll="true"
        @dragstart="onDragStart"
        @drop="onDropTree"
      />
    </div>
    <div
      class="flex-[7] min-h-[300px] bg-gray-50 rounded-xl border shadow-sm p-4 transition-all duration-300"
      :class="isDraggingOver ? 'ring-2 ring-blue-400 border-blue-500' : ''"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <h2 class="text-lg font-semibold text-gray-800 mb-4">已拖拽节点</h2>
      <ul class="space-y-2">
        <li
          v-for="item in droppedItems"
          :key="item.key"
          class="bg-white px-4 py-2 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuid } from 'uuid'
import { throttle } from 'lodash'

const draggedNode = ref<any>(null)
const isDraggingOver = ref(false)
const dropTarget = ref<HTMLElement | null>(null)
const droppedItems = ref<any[]>([])

const treeData = ref([
  {
    title: '组织架构',
    key: uuid(),
    children: [
      { title: '行政部', key: uuid() },
      { title: '技术部', key: uuid() },
      {
        title: '市场部',
        key: uuid(),
        children: [
          { title: '国内销售', key: uuid() },
          { title: '国际销售', key: uuid() }
        ]
      }
    ]
  },
  {
    title: '项目管理',
    key: uuid(),
    children: [
      { title: '项目 A', key: uuid() },
      { title: '项目 B', key: uuid() },
      {
        title: '项目 C',
        key: uuid(),
        children: [
          { title: '项目 C-1', key: uuid() },
          { title: '项目 C-2', key: uuid() }
        ]
      }
    ]
  },
  {
    title: '客户支持',
    key: uuid(),
    children: [
      { title: '技术支持', key: uuid() },
      { title: '客户服务', key: uuid() },
      {
        title: '售后服务',
        key: uuid(),
        children: [
          { title: '维修服务', key: uuid() },
          { title: '退货服务', key: uuid() }
        ]
      }
    ]
  },
  {
    title: '财务部',
    key: uuid(),
    children: [
      { title: '会计', key: uuid() },
      { title: '财务分析', key: uuid() },
      {
        title: '资金管理',
        key: uuid(),
        children: [
          { title: '现金流管理', key: uuid() },
          { title: '成本控制', key: uuid() }
        ]
      }
    ]
  },
  {
    title: '人力资源',
    key: uuid(),
    children: [
      { title: '招聘', key: uuid() },
      { title: '员工关系', key: uuid() },
      {
        title: '培训与发展',
        key: uuid(),
        children: [
          { title: '员工培训', key: uuid() },
          { title: '领导力发展', key: uuid() }
        ]
      }
    ]
  }
])

const onDragStart = (info: { event: DragEvent; node: any }) => {
  draggedNode.value = info.node
  info.event.dataTransfer?.setData('text/plain', info.node.key)
}

const onDropTree = (info: any) => {
  const dragKey = info.dragNode.key
  const dropKey = info.node.key
  const dropPos = info.dropPosition
  const dropToGap = info.dropToGap

  const loop = (data: any[], key: string, callback: (item: any, index: number, arr: any[]) => void) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) return callback(data[i], i, data)
      if (data[i].children) loop(data[i].children, key, callback)
    }
  }

  const data = [...treeData.value]
  let dragObj: any
  loop(data, dragKey, (item, index, arr) => {
    arr.splice(index, 1)
    dragObj = item
  })

  if (!dropToGap) {
    loop(data, dropKey, item => {
      item.children = item.children || []
      item.children.push(dragObj)
    })
  } else {
    let ar: any[] = []
    let i = 0
    loop(data, dropKey, (_, index, arr) => {
      ar = arr
      i = index
    })
    if (dropPos === -1) ar.splice(i, 0, dragObj)
    else ar.splice(i + 1, 0, dragObj)
  }

  treeData.value = data
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  dropTarget.value = event.target as HTMLElement
  isDraggingOver.value = true
}

const handleDragOver = throttle((event: DragEvent) => {
  console.log('handleDragOver')
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'copy'
}, 200)

const handleDragLeave = (event: DragEvent) => {
  if (event.target === dropTarget.value) {
    isDraggingOver.value = false
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDraggingOver.value = false

  if (draggedNode.value) {
    const exists = droppedItems.value.some(i => i.key === draggedNode.value.key)
    if (!exists) {
      droppedItems.value.push({
        ...draggedNode.value,
        title: draggedNode.value.title
      })
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.ant-tree-title) {
  position: relative;
  top: 4px;
}
:deep(.ant-tree .ant-tree-node-content-wrapper:hover),
:deep(.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected) {
  background-color: transparent !important;
}
</style>
