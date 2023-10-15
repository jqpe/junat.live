import { vi, it, expect } from 'vitest'

import { close } from '~/base/close'

it('calls client.end if client is not disconnected already', async () => {
  const client: any = {
    disconnected: false,
    end: vi
      .fn()
      .mockImplementation((_force: boolean, cb: (error?: Error) => void) => {
        cb()
      })
  }

  expect(async () => await close(client)).not.toThrow()

  expect(client.end).toHaveBeenCalledOnce()
})

it('returns true if client is disconnected', async () => {
  const client: any = { disconnected: true }

  expect(await close(client)).toStrictEqual(true)
})
