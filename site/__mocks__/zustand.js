import { create as actualCreate } from 'zustand'
import { act } from '@testing-library/react'

import { afterEach } from 'vitest'

// a variable to hold reset functions for all stores declared in the app
const storeResetFns = new Set()

// when creating a store, we get its initial state, create a reset function and add it in the set
export const create = createState => {
  const store = actualCreate(createState)
  const initialState = store.getState()
  storeResetFns.add(() => store.setState(initialState, true))

  return store
}

// Reset all stores after each test run
afterEach(() => {
  act(() => {
    for (const resetFn of storeResetFns) {
      resetFn()
    }
  })
})
