import { DigitrafficError } from './classes/digitraffic_error.js'
import { getUrl } from './get_url.js'

interface CreateFetchOptions {
  signal?: AbortSignal
  query?: URLSearchParams
}

/**
 * @throws {@link TypeError} if path doesn't start with /
 * @throws {@link DigitrafficError} if {@link  https://developer.mozilla.org/en-US/docs/Web/API/Response/ok Response.ok } is false or if a network error occured.
 * @throws {@link SyntaxError} if response body wasn't JSON and couldn't be parsed.
 *
 * @internal
 */
export const createFetch = async <T>(
  path: string,
  { query, signal }: CreateFetchOptions = {}
) => {
  if (!('fetch' in globalThis)) {
    throw new TypeError(
      'Expected fetch to be defined. Use a polyfill and write to globalThis.fetch, see https://github.com/node-fetch/node-fetch#providing-global-access for example.'
    )
  }

  if (!path.startsWith('/')) {
    throw new TypeError(
      `Expected path ${path} to start with a slash /, but instead received ${path[0]}`
    )
  }

  if (signal?.aborted) {
    return
  }

  const response = await fetch(getUrl(path, query), { signal }).catch(() => {
    // https://fetch.spec.whatwg.org/#concept-network-error
    throw new DigitrafficError({
      path,
      query,
      type: 'error',
      status: 0,
      statusText: '',
      body: null
    })
  })

  if (!response.ok) {
    throw new DigitrafficError({
      path,
      statusText: response.statusText,
      status: response.status,
      type: response.type,
      body: await response.text().catch()
    })
  }

  // response.json() will error as there is no response body
  if (signal?.aborted) {
    return
  }

  return (await response.json()) as T
}
