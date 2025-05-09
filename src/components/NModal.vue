<!-- components/NModal.vue -->
<template>
  <Teleport to="body">
    <a-modal
      v-bind="$attrs"
      :visible="visible"
      :title="title"
      :footer="footer ? undefined : null"
      :ok-text="okText"
      :cancel-text="cancelText"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <slot></slot>
    </a-modal>
  </Teleport>
</template>

<script lang="ts" setup>
defineProps({
  visible: { type: Boolean, required: true },
  title: { type: String, default: '提示' },
  footer: { type: Boolean, default: true },
  okText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' }
})

const emit = defineEmits(['update:visible', 'ok', 'cancel'])

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

const handleOk = () => {
  emit('ok')
}
</script>
