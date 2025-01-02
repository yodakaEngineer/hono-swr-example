'use client'
import { useGetMessage } from './hooks/useGetMessage'

export default function Home() {
  const { data } = useGetMessage()

  if (!data) return <p>Loading...</p>

  return <p>{data.message}</p>
}
