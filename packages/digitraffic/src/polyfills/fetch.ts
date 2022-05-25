import fetch, { Headers, Request, Response } from 'node-fetch'

if (!globalThis.fetch || process.env.NODE_ENV === 'test') {
  globalThis.fetch = fetch as typeof globalThis.fetch
  globalThis.Headers = Headers as typeof globalThis.Headers
  globalThis.Request = Request as unknown as typeof globalThis.Request
  globalThis.Response = Response as typeof globalThis.Response
}
