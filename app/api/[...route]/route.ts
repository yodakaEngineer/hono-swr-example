import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { z } from 'zod'

export const runtime = 'edge'

const app = new Hono()
  .basePath('/api')
  .get('/hello', (c) => {
    return c.json({
      message: 'Hello from Hono!',
    })
  })
  .post('/message', zValidator('json', z.object({
    message: z.string(),
  })), async (c) => {
    const { message } = c.req.valid('json')
    return c.json({
      message: `Message received: ${message}`,
    })
  })
export const GET = handle(app)
export const POST = handle(app)
export type AdminAppType = typeof app