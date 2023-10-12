import React from 'react'

/**
 * Stores run in SSR by default. Using this hook we can use a store on the client only.
 */
export const useClientStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F
  const [data, setData] = React.useState<F>()

  React.useEffect(() => {
    setData(result)
  }, [result])

  return data
}
