declare function structuredClone<T>(
  value: T,
  { transfer }: { transfer?: any[] } = {}
) {
  return value
}
