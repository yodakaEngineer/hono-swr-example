'use client'
import { useState } from 'react'
import { useGetMessage } from './hooks/useGetMessage'
import { usePostMessage } from './hooks/usePostMessage'

export default function Home() {
  const { data } = useGetMessage()
  const { trigger } = usePostMessage()
  const [message, setMessage] = useState('')

  return (
    <div>
      <div>
        <h1>Initial Message</h1>
        <p>{data.message}</p>
      </div>
      <div>
        <h1>Send Message</h1>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={() => trigger({ data: { message } })}>Send Message</button>
      </div>
    </div>
  )
}
