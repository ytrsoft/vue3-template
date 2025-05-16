<script lang="ts" setup>
  import {
    NFormProps,
    NFormEmits,
    NRaw
  } from '../types/index.ts'
  const formRef = ref()
  const props = withDefaults(defineProps<NFormProps>(), {
    col: 1,
    editable: true
  })
  const emit = defineEmits<NFormEmits>()
  const formData = ref<NRaw<typeof props.schema>>({})
  const handleChange = (value) => {
    console.log('change', value)
  }
  const handleSubmit = async () => {
    try {
      await formRef.value?.validate()
      emit('submit', raw.value)
    } catch (ignored) {}
  }
</script>

<template>
  <AForm
    ref="formRef"
    :model="formData"
    layout="horizontal"
    :wrapper-col="{ span: 18 }"
    :label-col="{ span: 6 }">
    <ARow :gutter="16">
      <ACol :span="24 / props.col" v-for="schema in props.schema" :key="schema.field">
        <AFormItem
          :rules="props.editable ? schema.rules : []"
          :label="schema.label"
          :name="schema.field">
          <NFormItem
            v-model:value="formData[schema.field]"
            :schema="schema"
            :editable="props.editable" 
            @change="handleChange($event)"/>
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>