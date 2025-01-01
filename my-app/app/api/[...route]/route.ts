import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono()
  .basePath('/api')
  .get('/hello', (c) => {
    return c.json({
      message: 'Hello from Hono!',
    })
  })

export const GET = handle(app)

export type AdminAppType = typeof app