import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { usePeristedAlerts } from '../src/use_persisted_alerts'

describe('usePeristedAlerts', () => {
  beforeEach(() => {
    localStorage.clear()
    usePeristedAlerts.setState(usePeristedAlerts.getInitialState())
  })

  it('initializes with empty alerts array', () => {
    const store = usePeristedAlerts.getState()
    expect(store.alerts).toEqual([])
  })

  it('adds alert ID to alerts array when hideAlert is called', () => {
    const store = usePeristedAlerts.getState()

    act(() => {
      store.actions.hideAlert('test-alert-1')
    })

    expect(usePeristedAlerts.getState().alerts).toEqual(['test-alert-1'])
  })

  it('persists alerts to localStorage', () => {
    const store = usePeristedAlerts.getState()

    act(() => {
      store.actions.hideAlert('test-alert-2')
    })

    const storedData = JSON.parse(localStorage.getItem('hidden-alerts') || '{}')
    expect(storedData.state.alerts).toEqual(['test-alert-2'])
  })

  it('maintains existing alerts when adding new ones', () => {
    const store = usePeristedAlerts.getState()

    act(() => {
      store.actions.hideAlert('alert-1')
      store.actions.hideAlert('alert-2')
    })

    expect(usePeristedAlerts.getState().alerts).toEqual(['alert-1', 'alert-2'])
  })

  it('excludes actions from persisted state', () => {
    const store = usePeristedAlerts.getState()

    act(() => {
      store.actions.hideAlert('test-alert')
    })

    const storedData = JSON.parse(localStorage.getItem('hidden-alerts') || '{}')
    expect(storedData.state.actions).toBeUndefined()
  })
})
