// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import fetch, { Headers, Request, Response } from 'node-fetch'

if (!globalThis.fetch || process.env.NODE_ENV === 'test') {
  globalThis.fetch = fetch
  globalThis.Headers = Headers
  globalThis.Request = Request
  globalThis.Response = Response
}
