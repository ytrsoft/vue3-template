import { ref } from 'vue'
import { instance as axios, createSource } from '../utils/net'
import type { AxiosRequestConfig, CancelTokenSource } from 'axios'

interface RequestOptions {
  immediate?: boolean
}

export type RequestConfig<R = any> = Partial<AxiosRequestConfig<R> & RequestOptions>

export const useRequest = <D = any>(config: RequestConfig<D>) => {
  const loading = ref(false)
  const data = ref({})
  const error = ref(null)
  const tokenSource = shallowRef<CancelTokenSource | null>(null)
  const sendRequest = async <D = any>(_config: RequestConfig<D>) => {
    loading.value = true
    error.value = null
    const source = createSource()
    tokenSource.value = source
    try {
      const response = await axios({
        ..._config,
         cancelToken: source.token
      })
      data.value = response.data
    } catch (err: any) {
      error.value = err.message || '未知错误'
    } finally {
      loading.value = false
    }
  }
  const retry = <D = any>(data: D) => {
    sendRequest({
      url: config.url,
      method: config.method,
      data
    })
  }
  const cancel = () => {
    if (tokenSource.value) {
      tokenSource.value.cancel('abort')
      tokenSource.value = null
    }
  }
  config.immediate ??= true
  if (config.immediate) {
    sendRequest(config)
  }
  return { loading, error, data, retry, cancel }
}

export const useGet = (url: string, data?: any) => {
  return useRequest({ method: 'GET', url, data})
}

export const usePost = <D = any>(config: RequestConfig<D>) => {
  return useRequest({ method: 'POST', ...config })
}

