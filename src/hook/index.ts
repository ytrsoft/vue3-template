import { ref } from 'vue'
import { instance as axios, createSource } from '../utils/net'
import type { AxiosRequestConfig, CancelTokenSource } from 'axios'

export const useRequest = <D = any>(config: AxiosRequestConfig<D>) => {
  const loading = ref(false)
  const data = ref(null)
  const error = ref(null)
  const tokenSource = shallowRef<CancelTokenSource | null>(null)
  const sendRequest = async () => {
    loading.value = true
    error.value = null
    const source = createSource()
    tokenSource.value = source
    try {
      const response = await axios({
        ...config,
         cancelToken: source.token
      })
      data.value = response.data
    } catch (err: any) {
      error.value = err.message || 'unknown error'
    } finally {
      loading.value = false
    }
  }
  const retry = (time = 1) => {
    if (time > 0) {
      setTimeout(() => {
        retry(time - 1)
      }, 0)
    }
  }
  const cancel = () => {
    if (tokenSource.value) {
      tokenSource.value.cancel('abort')
      tokenSource.value = null
    }
  }
  sendRequest()
  return { loading, error, data, retry, cancel }
}
