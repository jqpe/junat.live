import { it, vi, expect } from 'vitest'

import { hasConnected } from '../../src/utils/has_connected'

const client: any = {
  connected: false,
  on: vi
    .fn()
    .mockImplementation(function (_event = 'connect', callback: VoidFunction) {
      callback()
    })
}

it('connects if client.connected is true', async () => {
  expect(
    await hasConnected({ ...client, on: vi.fn(), connected: true })
  ).toStrictEqual(true)
})

it('rejects if timeout is reached', () => {
  expect(async () =>
    hasConnected({ ...client, on: vi.fn() }, 0)
  ).rejects.and.toThrow(/Connection timeout exceeded/)
})

it('listens to the connect event', async () => {
  expect(await hasConnected(client)).toStrictEqual(true)
  expect(client.on).toHaveBeenCalledOnce()
})
