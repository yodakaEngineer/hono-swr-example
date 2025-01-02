import { ClientResponse, hc } from 'hono/client'
import type { StatusCode } from 'hono/utils/http-status'
import { useCallback } from 'react'
import { useAuth } from './useAuth'
import { AdminAppType } from '../api/[...route]/route'

const baseUrl = 'http://localhost:3000'

export const generateSWRKey = (
  path: string,
  query?: Record<string, string>,
) => {
  // host名の部分を削除
  let relativePath = path.replace(/^\/|\/$/g, '')
  // queryの値を置換
  Object.entries(query || {}).forEach(([key, value]) => {
    const regexp = new RegExp(`:${key}`, 'g')
    relativePath = relativePath.replace(regexp, value)
  })
  return relativePath
}

type ServerError =
  // Serverからバリデーションエラー以外のエラーを返す場合、必ずこの形式にする
  | {
    message?: string
    code?: string
  }
  // Serverからバリデーションエラーを返す場合、必ずこの形式にする
  | {
    errors: {
      field?: string
      message?: string
    }[]
  }
export type HttpError<T extends ServerError = ServerError> = Error & {
  info?: T
  status?: number
}

export const useClient = () => {
  const { token } = useAuth()
  const headers = token
    ? {
      Authorization: `Bearer ${token}`,
    }
    : undefined
  return hc<AdminAppType>(baseUrl, {
    headers,
  })
}
export const useHandleResponse = () => {
  // const toast = useToast()
  const { logout } = useAuth()

  return useCallback(
    async <T>(res: ClientResponse<T, StatusCode, 'json'>) => {
      if (!res.ok) {
        const error: HttpError = new Error(
          'An error occurred while fetching the data.',
        )
        if (res.status === 401) {
          await logout()
          // SWRにハンドルさせるためにthrowする
          throw error
        }
        const data = await res.json()
        const errorInfo = data as any
        if (errorInfo.message) {
          // toast({
          //   title: 'エラー',
          //   description: errorInfo.message,
          //   status: 'error',
          //   duration: 5000,
          //   isClosable: true,
          //   position: 'top',
          // })
        }
        error.info = errorInfo
        error.status = res.status
        // SWRにハンドルさせるためにthrowする
        throw error
      }
      return await res.json()
    },
    [logout],
  )
}
