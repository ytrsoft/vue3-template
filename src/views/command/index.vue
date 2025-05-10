<template>
  <AButton type="primary" @click="postButton">触发</AButton>
</template>

<script setup lang="ts">
import { useModal } from '../../utils/modal'
import Logo from '../../components/Inner.vue'

const modal = useModal()

const postButton = () => {
  modal.info({
    title: '显示Logo',
    content: Logo,
    okText: '提交',
    cancelText: '关闭',
    modalProps: {
      width: 600
    },
    onOk: () => console.log('提交弹窗'),
    onCancel: () => console.log('关闭弹窗')
  })
}
</script>
