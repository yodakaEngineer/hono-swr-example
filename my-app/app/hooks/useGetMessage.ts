import useSWR from 'swr'
import { generateSWRKey, useClient, useHandleResponse } from '.';

export const useGetMessage = (
  isEnabled: boolean = true,
) => {
  const handleResponse = useHandleResponse()
  const client = useClient()
  const route = client.api.hello

  const fetcher = async () => {
    const $get = route.$get
    const res = await $get()
    return handleResponse(res).then((data) => {
      return data
    })
  }
  return useSWR(
    isEnabled
      ? generateSWRKey(route.$url().pathname)
      : null,
    fetcher,
    {
      suspense: true,
      // 非SSRの場合はuse clientすればfallbackDataはいらない
      fallbackData: {
        message: 'Loading...',
      },
    },
  )
}
