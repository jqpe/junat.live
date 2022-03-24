import { useState } from 'react'

interface FetchButtonDispatch {
  (
    action: Partial<Record<'isVisible' | 'isDisabled' | 'isLoading', boolean>>
  ): void
}

export interface FetchButton {
  isVisible: boolean
  isDisabled: boolean
  isLoading: boolean
  dispatch: FetchButtonDispatch
}

export default function useFetchButton(): FetchButton {
  const [isVisible, setIsVisble] = useState(true)
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch: FetchButtonDispatch = action => {
    if (typeof action.isDisabled !== 'undefined') {
      setIsDisabled(action.isDisabled)
    }
    if (typeof action.isVisible !== 'undefined') {
      setIsVisble(action.isVisible)
    }
    if (typeof action.isLoading !== 'undefined') {
      setIsLoading(action.isLoading)
    }
  }

  return { isDisabled, isVisible, isLoading, dispatch }
}
