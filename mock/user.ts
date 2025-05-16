import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const userList = Mock.mock({
  'list|72': [
    {
      'id|+1': 1,
      name: '@cname',
      age: '@integer(18, 60)',
      email: '@email'
    }
  ]
})

export interface Pager {
  currentPage: number
  pageSize: number
}

const userMock: MockMethod[] = [
  {
    url: '/api/users',
    method: 'get',
    response: ({ query }: { query: Pager }) => {
      const { currentPage = 1, pageSize = 10 } = query
      const list = userList.list
      const startIndex = (currentPage - 1) * pageSize
      const endIndex = startIndex + pageSize
      const pageData = list.slice(startIndex, endIndex)

      return {
        code: 200,
        message: 'success',
        data: {
          total: list.length,
          result: pageData
        }
      }
    }
  }
]

export default userMock
