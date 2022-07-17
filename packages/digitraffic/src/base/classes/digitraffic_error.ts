/**
 * @internal
 */
type DigitrafficErrorOpts = {
  path: string
  status: number
  statusText: string
  type: string
  body?: string
}

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
