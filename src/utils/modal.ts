import { createVNode, render, isVNode } from 'vue'
import { isString } from 'lodash'
import NModal from '../components/NModal.vue'

export interface ModalOptions {
  title?: string
  content?: string | VNode | object
  onOk?: () => void | Promise<void>
  onCancel?: () => void
  okText?: string
  cancelText?: string
  footer?: boolean
  modalProps?: Record<string, any>
  beforeClose?: () => boolean | Promise<boolean>
}

interface ModalInstance {
  close: () => void
}

const modalStack: ModalInstance[] = []

function createModal(options: ModalOptions): ModalInstance {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const getSlotContent = () => {
    if (isString(options.content)) return () => options.content
    if (isVNode(options.content)) return () => options.content
    return () => createVNode(options.content as object)
  }

  let loading = false

  const close = () => {
    render(null, container)
    container.remove()
    const index = modalStack.findIndex((item) => item.close === close)
    if (index !== -1) modalStack.splice(index, 1)
  }

  const handleOk = async () => {
    if (loading) return
    if (options.beforeClose) {
      const allowClose = await options.beforeClose()
      if (!allowClose) return
    }

    try {
      loading = true
      await options.onOk?.()
      close()
    } finally {
      loading = false
    }
  }

  const vnode = createVNode(NModal, {
    visible: true, // 使用者 API 依然用 visible
    title: options.title ?? '提示',
    footer: options.footer !== false,
    okText: options.okText ?? '确定',
    cancelText: options.cancelText ?? '取消',
    ...options.modalProps,
    onOk: handleOk,
    onCancel: () => {
      options.onCancel?.()
      close()
    },
    'onUpdate:visible': (val: boolean) => {
      if (!val) close()
    },
    'onUpdate:open': (val: boolean) => {
      if (!val) close()
    }
  }, {
    default: getSlotContent()
  })

  render(vnode, container)

  const instance: ModalInstance = { close }
  modalStack.push(instance)

  return instance
}

export const useModal = () => ({
  info: createModal,
  closeAll: () => {
    modalStack.forEach(modal => modal.close())
    modalStack.length = 0
  }
})
