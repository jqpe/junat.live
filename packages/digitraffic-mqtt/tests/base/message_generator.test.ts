import { messageGenerator } from '~/base/message_generator'
import { it, expect, vi } from 'vitest'

it('throws if client is not connected', () => {
  const client: any = { connected: false, prependOnceListener: vi.fn() }

  expect(() => messageGenerator(client).next()).rejects.and.toThrow(
    /Client must be connected\./
  )
  expect(client.prependOnceListener).not.toHaveBeenCalled()
})

it('yields promises when client emits messages', async () => {
  const client: any = {
    connected: true,
    prependOnceListener: vi.fn((_event, cb) => {
      cb(undefined, 1)
    })
  }
  const generator = messageGenerator(client)

  expect(await generator.next()).toStrictEqual({
    done: false,
    value: 1
  })
  expect(client.prependOnceListener).toHaveBeenCalledOnce()
  await generator.next()
  expect(client.prependOnceListener).toHaveBeenCalledTimes(2)
})

it.each([['disconnected'], ['disconnecting']])(
  "breaks when client's status changes to %s",
  state => {
    const client: any = {
      connected: true,
      prependOnceListener: vi.fn()
    }

    client[state] = true

    expect(async () => await messageGenerator(client).next()).not.toThrow()
    expect(client.prependOnceListener).not.toHaveBeenCalled()
  }
)
