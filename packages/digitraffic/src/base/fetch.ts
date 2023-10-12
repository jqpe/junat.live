import { DigitrafficError } from '../index.js'

/**
 * Fetch using `globalThis.fetch`, but **error on all non 2xx status codes** and network errors.
 * Does not attempt to process the response.
 *
 * @throws DigitrafficError
 */
export const fetchWithError: typeof globalThis.fetch = async (input, init) => {
  let url = new URL(input.toString())

  if (input instanceof Request) {
    url = new URL(input.url)
  }
  
  const query = url.searchParams

  const response = await fetch(input, init).catch(() => {
    // https://fetch.spec.whatwg.org/#concept-network-error
    throw new DigitrafficError({
      path: url.pathname,
      query,
      type: 'error',
      status: 0,
      statusText: '',
      body: null
    })
  })

  if (!response.ok) {
    throw new DigitrafficError({
      path: url.pathname,
      statusText: response.statusText,
      status: response.status,
      type: response.type,
      body: await response.text().catch()
    })
  }

  return response
}
