import React from 'react'

const useStore = <T, F>(
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

export default useStore
