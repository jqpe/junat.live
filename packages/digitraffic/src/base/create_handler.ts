export interface HandlerOptions {
  /**
   * Signal used to abort the fetch if needed.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortController
   */
  signal?: AbortSignal
}

/**
 * Ensures that fetch is defined otherwise halts.
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const createHandler = <T extends Function>(fn: T) => {
  if (!globalThis.fetch) {
    throw new TypeError(
      'Fetch is not defined. You can install a polyfill and write to globalThis.fetch or use a later node version (v17-v18).'
    )
  }

  return fn
}
