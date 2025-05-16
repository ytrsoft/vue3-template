<script lang="ts" setup>
  import {
    NFormProps,
    NFormEmits,
    NRaw,
    NSchema
  } from '../types/index.ts'
  const formRef = ref()
  const props = withDefaults(defineProps<NFormProps>(), {
    col: 1,
    editable: true
  })
  const emit = defineEmits<NFormEmits>()
  const formData = ref<NRaw<typeof props.schema>>({})
  const handleChange = (schema: NSchema, oldValue: any) => {
    if (schema.trigger) {
      schema.trigger({
        value: oldValue,
        data: formData.value,
        next: (key, newValue) => {
          formData.value[key] = newValue || oldValue
        }
      })
    }
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
            v-if="schema.type !== 'custom'"
            v-model:value="formData[schema.field]"
            :schema="schema"
            :editable="props.editable" 
            @change="handleChange(schema, $event)"/>
          <slot 
            v-else
            :name="schema.field" 
            :schema="schema" 
            :raw="formData" />
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>