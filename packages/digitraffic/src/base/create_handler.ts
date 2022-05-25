// eslint-disable-next-line @typescript-eslint/ban-types
export const createHandler = <T extends Function>(fn: T) => {
  return fn
}
