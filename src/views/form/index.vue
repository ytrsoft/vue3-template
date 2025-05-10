<template>
  <div class="bg-white shadow-md rounded-xl p-8">
    <h2 class="text-2xl font-semibold text-gray-800">动态表单</h2>
    <div class="mt-4">
      <AButton @click="toggleEditable" type="default">
        {{ editable ? '只读' : '编辑' }}
      </AButton>
    </div>

    <div class="mt-8">
      <NForm
        :col="3"
        :editable="editable"
        :schema="schema"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { SchemaItem } from '../../types'

const editable = ref(true)

const schema: Array<SchemaItem> = [
  {
    type: 'input',
    label: '姓名',
    field: 'name',
    rules: [{ required: true, message: '请输入姓名' }],
    trigger: ({ next, value }) => {
      next('nickname', '别名@' + value)
    }
  },
   {
    type: 'input',
    label: '姓名',
    field: 'nickname'
  },
  {
    type: 'input',
    label: '邮箱',
    field: 'email',
    rules: [
      { required: true, message: '请输入邮箱地址' },
      { type: 'email', message: '请输入有效的邮箱地址' }
    ],
  },
  {
    type: 'select',
    label: '性别',
    field: 'gender',
    rules: [{ required: true, message: '请选择性别' }],
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
      { label: '其他', value: 'other' }
    ]
  },
  {
    type: 'date',
    label: '出生日期',
    field: 'dob',
    rules: [{ required: true, message: '请选择出生日期' }],
  },
  {
    type: 'checkbox',
    label: '兴趣爱好',
    field: 'hobbies',
    options: [
      { label: '阅读', value: 'reading' },
      { label: '旅行', value: 'travelling' },
      { label: '运动', value: 'sports' }
    ]
  },
  {
    type: 'textarea',
    label: '个人简介',
    field: 'bio',
  },
  {
    type: 'radio',
    label: '是否接受',
    field: 'acceptTerms',
    options: [
      { label: '是', value: '1' },
      { label: '否', value: '0' }
    ],
    rules: [{ required: true, message: '您必须接受条款才能提交' }]
  }
]

const onSubmit = (raw: any) => {
  console.log('提交的数据:', JSON.stringify(raw, null, 2))
}

const toggleEditable = () => {
  editable.value = !editable.value
}
</script>
