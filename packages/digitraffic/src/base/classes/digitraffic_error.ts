type DigitrafficErrorOpts = {
  /**
   * The requested path
   */
  path: string
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
  statusText: string
  /**
   * `Response.type`
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/type
   */
  type: string
  /**
   * Body as text
   */
  body?: string
}

/**
 * Error class thrown by all handler functions when request failed for any reason
 */
export class DigitrafficError implements DigitrafficErrorOpts {
  readonly path
  readonly body
  readonly status
  readonly statusText
  readonly type

  constructor({ path, body, status, statusText, type }: DigitrafficErrorOpts) {
    this.path = path
    this.status = status
    this.body = body
    this.statusText = statusText
    this.type = type
  }
}
