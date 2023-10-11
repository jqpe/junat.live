/**
 * Get the first erroneus query from a list of queries, in ascending order, if any.
 */
export const getErrorQuery = <T extends { isError: boolean }>(queries: T[]) => {
  return queries.find(query => query.isError)
}
