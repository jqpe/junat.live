import { expect, it, vi } from 'vitest'

import { messageGenerator } from '../../src/base/message_generator'

it('throws if client is not connected', async () => {
  const client: any = { connected: false, on: vi.fn() }

  await expect(() => messageGenerator(client, '').next()).rejects.and.toThrow(
    /Client must be connected\./,
  )
  expect(client.on).not.toHaveBeenCalled()
})

it('yields promises when client emits messages', async () => {
  let id: NodeJS.Timeout | undefined

  const client: any = {
    connected: true,
    on: vi.fn((_event, cb) => {
      id = setInterval(() => cb('', 1), 1)
    }),
  }

  const generator = messageGenerator(client, '')

  expect(await generator.next()).toStrictEqual({
    done: false,
    value: 1,
  })

  expect(client.on).toHaveBeenCalledOnce()

  await generator.next()

  expect(client.on).toHaveBeenCalledOnce()

  clearInterval(id)
})

it.each([['disconnected'], ['disconnecting']])(
  "breaks when client's status changes to %s",
  state => {
    const client: any = {
      connected: true,
      on: vi.fn(),
      removeListener: vi.fn(),
    }

    client[state] = true

    expect(async () => await messageGenerator(client, '').next()).not.toThrow()
    expect(client.removeListener).toHaveBeenCalledOnce()
  },
)
