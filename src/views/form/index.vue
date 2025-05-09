<template>
  <div class="bg-white shadow-md rounded-xl p-8">
    <h2 class="text-2xl font-semibold text-gray-800">动态表单</h2>
    <div class="mt-8">
      <NForm
        :col="3"
        :editable="false"
        :schema="schema"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { SchemaItem } from '../../types'

const schema: Array<SchemaItem> = [
  {
    field: 'name',
    label: '姓名',
    type: 'input',
    rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    trigger: (event) => {
      console.log('name changed:', event.value)
    }
  },
  {
    field: 'gender',
    label: '性别',
    type: 'select',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
    rules: [{ required: true, message: '请选择性别', trigger: 'change' }],
    trigger: (event) => {
      console.log('gender changed:', event.value)
    }
  },
  {
    field: 'hobbies',
    label: '爱好',
    type: 'checkbox',
    options: [
      { label: '阅读', value: 'reading' },
      { label: '旅行', value: 'travel' },
      { label: '运动', value: 'sports' },
    ],
    rules: [{ required: true, message: '请选择至少一个爱好', trigger: 'change' }],
    trigger: (event) => {
      console.log('hobbies changed:', event.value)
    }
  },
  {
    field: 'dob',
    label: '出生日期',
    type: 'date',
    rules: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
    trigger: (event) => {
      console.log('dob changed:', event.value)
    }
  },
]

const onSubmit = (raw: any) => {
  console.log('提交数据:', raw)
}
</script>
