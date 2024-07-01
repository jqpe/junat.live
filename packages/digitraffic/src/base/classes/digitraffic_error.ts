/**
 * `Response.type`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/type
 * @see https://fetch.spec.whatwg.org/#concept-response-type
 */
type ResponseType =
  | 'basic'
  | 'cors'
  | 'default'
  | 'error'
  | 'opaque'
  | 'opaqueredirect'

type DigitrafficErrorOpts = {
  /**
   * The requested path
   */
  path: string
  /**
   * Query added as a parameter
   */
  query?: URLSearchParams
  /**
   * `Response.type`
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/type
   * @see https://fetch.spec.whatwg.org/#concept-response-type
   */
  type: ResponseType
  /**
   * `Response.status`
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/status
   */
  status: number
  /**
   * `Response.statusText`
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/statusText
   */
  statusText?: string
  /**
   * Body as text
   */
  body?: string | null
}

/**
 * Error class thrown by all handler functions when request failed for any reason
 */
export class DigitrafficError extends Error implements DigitrafficErrorOpts {
  public readonly name = 'DigitrafficError'

  public readonly path
  public readonly body
  public readonly status
  public readonly statusText
  public readonly type
  public readonly query

  constructor({
    path,
    body,
    status,
    statusText,
    type,
    query,
  }: DigitrafficErrorOpts) {
    super()
    super.name = 'DigitrafficError'
    super.message = `Request to ${path} failed with status code ${status}`

    if (type === 'error') {
      super.message = `Request to ${path} failed due to a network error`
    }

    this.path = path
    this.status = status
    this.body = body
    this.statusText = statusText
    this.type = type
    this.query = query
  }

  /**
   * Whether this request failed due to a network error, e.g. the server closing the connection unexpectedly.
   */
  public get isNetworkError(): boolean {
    return this.type === 'error'
  }

  /**
   * The full URL used to perform this request
   */
  public get url(): string {
    const base = `https://rata.digitraffic.fi${this.path}`
    const query = this.query ? `?${this.query}` : ''

    return base + query
  }
}
