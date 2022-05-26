import { getUrl } from './get_url'

interface CreateFetchOptions {
  signal?: AbortSignal
  query?: URLSearchParams
}

/**
 *
 * @throws {TypeError} if path doesn't start with /
 * @throws {Error} if request didn't return a status code in range 200-299 (https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
 * @throws {SyntaxError} if response body wasn't JSON and couldn't be parsed.
 *
 * @internal
 */
export const createFetch = async <T>(
  path: string,
  { query, signal }: CreateFetchOptions = {}
) => {
  if (!path.startsWith('/')) {
    throw new TypeError(
      `Expected path ${path} to start with a slash /, but instead received ${path[0]}`
    )
  }

  if (signal?.aborted) {
    return
  }

  const response = await fetch(getUrl(path, query), { signal })

  if (!response.ok) {
    throw new Error(
      `Request to ${path} failed with status code ${
        response.status
      }: ${await response.text()}`
    )
  }

  return (await response.json()) as T
}
