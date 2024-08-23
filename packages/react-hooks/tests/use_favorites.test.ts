import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useFavorites } from '../src/use_favorites'

describe('useFavorites', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useFavorites())
    const store = result.current

    act(() => {
      store.favorites.forEach(store.removeFavorite)
    })
  })

  it('should initialize with an empty favorites array', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })

  it('should add a favorite station', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite('HKI')
    })
    expect(result.current.favorites).toEqual(['HKI'])
  })

  it('should not add a duplicate favorite station', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite('HKI')
      result.current.addFavorite('HKI')
    })
    expect(result.current.favorites).toEqual(['HKI'])
  })

  it('should remove a favorite station', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite('HKI')
      result.current.addFavorite('TKU')
      result.current.removeFavorite('HKI')
    })
    expect(result.current.favorites).toEqual(['TKU'])
  })

  it('should check if a station is a favorite', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite('HKI')
    })
    expect(result.current.isFavorite('HKI')).toBe(true)
    expect(result.current.isFavorite('TKU')).toBe(false)
  })

  it('should persist favorites across renders', () => {
    const { result, rerender } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite('HKI')
    })
    rerender()
    expect(result.current.favorites).toEqual(['HKI'])
  })

  it('should return true when adding a new favorite', () => {
    const { result } = renderHook(() => useFavorites())
    let addResult
    act(() => {
      addResult = result.current.addFavorite('HKI')
    })
    expect(addResult).toBe(true)
  })

  it('should return false when adding an existing favorite', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite('HKI')
    })
    let addResult
    act(() => {
      addResult = result.current.addFavorite('HKI')
    })
    expect(addResult).toBe(false)
  })

  it('should return true when removing an existing favorite', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.addFavorite('HKI')
    })
    let removeResult
    act(() => {
      removeResult = result.current.removeFavorite('HKI')
    })
    expect(removeResult).toBe(true)
  })

  it('should return false when removing a non-existing favorite', () => {
    const { result } = renderHook(() => useFavorites())
    let removeResult
    act(() => {
      removeResult = result.current.removeFavorite('HKI')
    })
    expect(removeResult).toBe(false)
  })
})
