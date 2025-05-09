export interface Response<T = any> {
  message: string
  code: number
  data: T
}
