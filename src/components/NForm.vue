<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { cloneDeep } from 'lodash'
import type { NFormProps, NFormEmits, NFormData, SchemaItem } from '../types'
import { getFieldLabel } from '../utils'

const formRef = ref()
const props = withDefaults(defineProps<NFormProps>(), {
  col: 1,
  editable: true
})
const emit = defineEmits<NFormEmits>()
const formData = ref<NFormData>({})

watch(() => props.schema, () => {
  props.schema.forEach(item => {
    if (item.field) formData.value[item.field] = ''
  })
}, { immediate: true })

const wrapperCol = computed(() => ({
  span: 24 / props.col,
  offset: 24 - (24 / props.col)
}))

const handleFieldChange = (item: SchemaItem, value: any) => {
  if (item.trigger) {
    const data = cloneDeep(formData.value)
    item.trigger({
      value,
      data,
      next: (key, updatedValue) => {
        formData.value[key] = updatedValue ?? value
      }
    })
  }
}

const setFormData = (data: NFormData) => {
  formData.value = data
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  const submittedData = cloneDeep(formData.value)
  emit('submit', submittedData)
  resetFormData()
}

const resetFormData = () => {
  props.schema.forEach(item => {
    if (item.field) formData.value[item.field] = ''
  })
}

defineExpose({ setFormData })
</script>

<template>
  <AForm
    ref="formRef"
    :model="formData"
    layout="horizontal"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
  >
    <ARow :gutter="16">
      <ACol :span="24 / props.col" v-for="item in props.schema" :key="item.field">
        <AFormItem
          :rules="props.editable ? item.rules : []"
          :label="item.label"
          :name="item.field"
          :colon="true"
        >
          <template v-if="item.type === 'input' && item.field">
            <AInput
              v-if="props.editable"
              v-model:value="formData[item.field]"
              :placeholder="`请输入${item.label}`"
              @input="handleFieldChange(item, $event.target.value)"
            />
            <div v-else>{{ getFieldLabel(formData[item.field], item) }}</div>
          </template>
          <template v-if="item.type === 'select' && item.field">
            <ASelect
              v-if="props.editable"
              v-model:value="formData[item.field]"
              :placeholder="`请选择${item.label}`"
              @change="handleFieldChange(item, $event)"
            >
              <ASelectOption
                v-for="option in item.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </ASelectOption>
            </ASelect>
            <div v-else>{{ getFieldLabel(formData[item.field], item) }}</div>
          </template>
          <template v-if="item.type === 'checkbox' && item.field">
            <ACheckboxGroup
              v-if="props.editable"
              v-model:value="formData[item.field]"
              @change="handleFieldChange(item, $event)"
            >
              <ACheckbox
                v-for="option in item.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </ACheckbox>
            </ACheckboxGroup>
            <div v-else>{{ getFieldLabel(formData[item.field], item) }}</div>
          </template>
          <template v-if="item.type === 'radio' && item.field">
            <ARadioGroup
              v-if="props.editable"
              v-model:value="formData[item.field]"
              @change="handleFieldChange(item, $event)"
            >
              <ARadio
                v-for="option in item.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </ARadio>
            </ARadioGroup>
            <div v-else>{{ getFieldLabel(formData[item.field], item)}}</div>
          </template>
          <template v-if="item.type === 'date' && item.field">
            <ADatePicker
              v-if="props.editable"
              style="width: 100%"
              v-model:value="formData[item.field]"
              @change="handleFieldChange(item, $event)"
            />
            <div v-else>{{ getFieldLabel(formData[item.field], item) }}</div>
          </template>
          <template v-if="item.type === 'textarea' && item.field">
            <ATextArea
              v-if="props.editable"
              v-model:value="formData[item.field]"
              :placeholder="`请输入${item.label}`"
              @input="handleFieldChange(item, $event.target.value)"
            />
            <div v-else class="whitespace-pre-wrap">{{ getFieldLabel(formData[item.field], item) }}</div>
          </template>
          <template v-if="item.type === 'custom'">
            <slot :name="item.field" :field="item.field" :value="formData[item.field as any]" />
          </template>
        </AFormItem>
      </ACol>
    </ARow>

    <AFormItem v-if="props.editable" :wrapper-col="wrapperCol">
      <div class="flex justify-end">
        <AButton type="primary" @click="handleSubmit">提交</AButton>
      </div>
    </AFormItem>
  </AForm>
</template>
