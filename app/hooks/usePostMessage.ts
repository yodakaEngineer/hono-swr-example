import useSWRMutation from 'swr/mutation'
import { useClient, useHandleResponse, generateSWRKey } from '.'
import type { InferRequestType } from 'hono/client'

export const usePostMessage = () => {
  const handleResponse = useHandleResponse()
  const client = useClient()
  const route = client.api.message
  const cacheKey = generateSWRKey(route.$url().pathname)
  const $post = route.$post
  type Request = InferRequestType<typeof $post>['json']

  const mutate = async (
    cacheKey: string,
    { arg }: { arg: { data: Request } },
  ) => {
    const res = await $post({
      json: {
        ...arg.data,
      },
    })
    return handleResponse(res)
      .then((res) => {
        alert(res.message)
      })
  }

  return useSWRMutation(cacheKey, mutate)
}
