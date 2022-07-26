import { afterAll, beforeAll, vi } from 'vitest'

beforeAll(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
})

afterAll(() => {
  vi.resetAllMocks()
})
