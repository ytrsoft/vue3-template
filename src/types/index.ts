import type { RuleObject } from 'ant-design-vue/es/form/interface'

export type NFieldType = 
  | 'input' | 'select' | 'checkbox' | 'radio' 
  | 'date' | 'textarea' | 'custom' | 'number' 
  | 'password' | 'daterange' | 'time'

export interface Option<T = string> {
  label: string
  value: T
  disabled?: boolean
}

export type NFormRules = RuleObject | RuleObject[]

export interface NSchema {
  field: string
  label: string
  type: NFieldType
  rules?: NFormRules
  props?: Record<string, any>
}

export interface NFormProps {
  col?: number
  editable?: boolean
  schema: NSchema[]
}

export type NSchemaFields<T extends readonly NSchema[]> = T[number]['field']
export type NRaw<T extends readonly NSchema[]> = Partial<Record<NSchemaFields<T>, any>>
export type NKey<T extends readonly NSchema[]> = NSchemaFields<T>
export type Next<T extends readonly NSchema[]> = (key: NKey<T>, value?: any) => void

export interface TriggerEvent<D = any, T extends readonly NSchema[] = NSchema[]> {
  value: D
  next: Next<T>
  data: NRaw<T>
  schema: NSchema
}

export type Trigger<T extends readonly NSchema[]> = (event: TriggerEvent<any, T>) => void

export interface NFormEmits<T extends readonly NSchema[]> {
  (event: 'submit', data: NRaw<T>): void
}

export interface NFormItemEmits<T = any> {
  (event: 'update:value', data: T): void
  (event: 'change', data: T): void
}

 export interface NFormItemProps<T = any> {
  value: T
  schema?: NSchema
  editable?: boolean
}