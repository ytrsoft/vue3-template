import type { RuleObject } from 'ant-design-vue/es/form'

type NFieldType = 'input' | 'select' | 'checkbox' | 'radio' | 'date' | 'textarea' | 'custom'

export type NFormRules = RuleObject | RuleObject[]

export interface Option {
  label: string
  value: string
}

interface ISchemaItem {
  field: string
  label: string
  rules: NFormRules
  type: NFieldType
  options?: Option[] 
  trigger?: Trigger
}

export type SchemaItem = Partial<ISchemaItem>

export interface NFormProps {
  col?: number
  editable?: boolean
  schema: Array<SchemaItem>
}

export type NFormData = {
  [K in Exclude<NFormProps['schema'][number]['field'], undefined>]: K extends keyof SchemaItem ? SchemaItem[K] : any
}

export type NFormKey = keyof NFormData

export type Next = (key: NFormKey, value?: any) => void

export interface TriggerEvent {
  value: any
  next: Next
  data: NFormData
}

export type Trigger = (event: TriggerEvent) => void

export interface NFormEmits {
  (event: 'submit', data: NFormData): void
}
