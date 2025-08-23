import { useContext } from 'react'

import { UiContext } from './provider'

export const useUi = () => {
  const ctx = useContext(UiContext)
  if (!ctx) {
    throw new Error('must initialize UiContext')
  }

  return ctx
}
