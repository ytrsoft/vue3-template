<template>
  <a-modal
    v-bind="$attrs"
    :open="visible"
    :title="title"
    :footer="footer ? undefined : null"
    :ok-text="okText"
    :cancel-text="cancelText"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <slot></slot>
  </a-modal>
</template>

<script lang="ts" setup>
defineProps({
  visible: { type: Boolean, required: true }, // 使用者仍然用 visible 控制
  title: { type: String, default: '提示' },
  footer: { type: Boolean, default: true },
  okText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' }
})

const emit = defineEmits(['update:visible', 'update:open', 'ok', 'cancel'])

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
  emit('update:open', false)
}

const handleOk = () => {
  emit('ok')
}
</script>
