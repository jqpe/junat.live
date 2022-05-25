// eslint-disable-next-line @typescript-eslint/ban-types
export const createHandler = async <T extends Function>(fn: T) => {
  return fn
}
