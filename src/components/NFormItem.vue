<script lang="ts" setup>
  import { Input as AInput } from 'ant-design-vue'
  import dayjs from 'dayjs'
  import { values } from 'lodash'
  import {
    NSchema,
    NFormItemProps,
    NFormItemEmits
  } from '../types/index.ts'
  const props = defineProps<NFormItemProps>()
  const emit = defineEmits<NFormItemEmits>()
  const onChange = (value, schema: NSchema) => {
    if (schema.type === 'date') {
      emit('update:value', value)
      emit('change', dayjs(value).format('YYYY-MM-DD'))
    } else {
      emit('update:value', value)
      emit('change', value)
    }
  }
  const unRaw = (schema: NSchema) => {
    if (schema.type === 'select' || schema.type === 'radio' ) {
      const find = (opt) => opt.value === props.value
      return schema.options?.find(find)?.label
    }
    if (schema.type === 'checkbox') {
      const selected = values(props.value)
      const filtered = (opt) => selected.includes(opt.value)
      const labels = schema.options?.filter(filtered).map((k) => k.label)
      return labels.join('  ｜  ')
    }
    if (schema.type === 'date') {
      return dayjs(props.value).format('YYYY-MM-DD')
    }
    return props.value
  }
  const getPlaceholder = (schema: NSchema) => {
    const select = ['select', 'date']
    if (select.includes(schema.type)) {
      return `请选择${schema.label}`
    }
    return `请输入${schema.label}`
  }
</script>

<template>
  <template v-if="editable">
    <AInput 
      v-if="schema.type === 'input'"
      :value="value"
      :placeholder="getPlaceholder(schema)"
      @input="onChange($event.target.value, schema)"/>
    <ASelect
      v-if="schema.type === 'select'"
      :value="value"
      :placeholder="getPlaceholder(schema)"
      @change="onChange($event, schema)">
      <ASelectOption
        v-for="option in schema.options"
        :key="option.value"
        :value="option.value">
        {{ option.label }}
      </ASelectOption>
    </ASelect>
     <ACheckboxGroup
      v-if="schema.type === 'checkbox'"
      :value="value"
      @change="onChange($event, schema)">
      <ACheckbox
        v-for="option in schema.options"
        :key="option.value"
        :value="option.value">
        {{ option.label }}
      </ACheckbox>
    </ACheckboxGroup>
    <ARadioGroup
      v-if="schema.type === 'radio'"
      :value="value"
      @change="onChange($event.target.value, schema)">
      <ARadio
        v-for="option in schema.options"
        :key="option.value"
        :value="option.value">
        {{ option.label }}
      </ARadio>
    </ARadioGroup>
    <AInput.TextArea
      v-if="schema.type === 'textarea'"
      :value="value"
      :placeholder="getPlaceholder(schema)"
      @input="onChange($event.target.value, schema)"/>
    <ADatePicker
      v-if="schema.type === 'date'"
      style="width: 100%"
      :placeholder="getPlaceholder(schema)"
      :value="value"
      @change="onChange($event, schema)"/>
  </template>
  <template v-else>
    <div class="whitespace-pre-wrap">{{ unRaw(schema) }}</div>
  </template>
</template>