import { vi, afterAll, beforeAll } from 'vitest'

beforeAll(() => {
  vi.mock('./constants/index.ts', () => ({
    MQTT_URL: 'mqtt://127.0.0.1:1883'
  }))
})

afterAll(() => {
  vi.restoreAllMocks()
})
