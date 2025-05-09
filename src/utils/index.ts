import { isArray } from 'lodash'
import type { SchemaItem } from '../types'

const getSingleLabel = (options: any, value: any): string => {
  if (!isArray(options)) return ''
  return options.find(opt => opt.value === value)?.label ?? ''
}

const getMultipleLabels = (options: any, values: any[]): string => {
  if (!isArray(options) || !isArray(values)) return ''
  return options
    .filter(opt => values.includes(opt.value))
    .map(opt => opt.label)
    .join(' | ') || ''
}

const getDateLabel = (value: any): string => {
  if (typeof value === 'string') return value
  if (value?.format) return value.format('YYYY-MM-DD')
  return value?.toString() || ''
}

export const getFieldLabel = (value: any, item: SchemaItem): string => {
  if (!item || value === undefined || value === null) return ''
  const { type, options } = item

  switch (type) {
    case 'select':
    case 'radio':
      return getSingleLabel(options, value)

    case 'checkbox':
      return getMultipleLabels(options, value)

    case 'date':
      return getDateLabel(value)

    case 'textarea':
    case 'input':
    default:
      return value?.toString() || ''
  }
}
