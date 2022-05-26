/// <reference types="vite/client" />

import { it, expect, vi } from 'vitest'

import { createHandler } from '../../src/base/create_handler'

it('each handler is created with create handler', async () => {
  vi.mock('../../src/base/create_handler', () => ({
    createHandler: vi.fn().mockName('createHandler')
  }))

  const definedHandlers = import.meta.glob('../../src/handlers/**/*')
  const modules = Object.values(definedHandlers)

  for (const loadModule of modules) {
    await loadModule()
  }

  expect(
    createHandler,
    'Ensures that all handlers inside src/handlers are called with `createHandler`'
  ).toHaveBeenCalledTimes(modules.length)

  vi.restoreAllMocks()
})
