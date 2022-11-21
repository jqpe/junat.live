export interface HandlerOptions {
  /**
   * Signal used to abort the fetch if needed.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortController
   */
  signal?: AbortSignal
}
