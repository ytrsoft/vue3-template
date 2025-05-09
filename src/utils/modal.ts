import { createVNode, render, isVNode } from 'vue'
import { isString } from 'lodash'
import NModal from '../components/NModal.vue'

export interface ModalOptions {
  title?: string
  content?: string | VNode | object
  onOk?: () => void
  onCancel?: () => void
  okText?: string
  cancelText?: string
  footer?: boolean
  modalProps?: Record<string, any>
}

function createModal(options: ModalOptions) {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const close = () => {
    render(null, container)
    document.body.removeChild(container)
  }

  const getSlotContent = () => {
    if (isString(options.content)) return options.content
    if (isVNode(options.content)) return options.content
    return createVNode(options.content as object)
  }

  const vnode = createVNode(NModal, {
    visible: true,
    title: options.title ?? '提示',
    footer: options.footer !== false,
    okText: options.okText ?? '确定',
    cancelText: options.cancelText ?? '取消',
    ...options.modalProps,
    onOk: () => {
      options.onOk?.()
      close()
    },
    onCancel: () => {
      options.onCancel?.()
      close()
    },
    'onUpdate:visible': (val: boolean) => {
      if (!val) close()
    }
  }, {
    default: getSlotContent
  })

  render(vnode, container)
}

export const useModal = () => ({
  info: createModal
})
