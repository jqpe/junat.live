// eslint-disable-next-line @typescript-eslint/ban-types
export const createHandler = async <T extends Function>(fn: T) => {
  if (!globalThis.fetch || process.env.NODE_ENV === 'test') {
    await import('../polyfills/fetch')
  }

  return fn
}
