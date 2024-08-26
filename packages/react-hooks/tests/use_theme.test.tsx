import type { Mock } from 'vitest'

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTheme } from '../src/use_theme'

describe('useTheme', () => {
  let mockClassList: {
    contains: Mock<[string], boolean>
  }
  let mockDocumentElement: HTMLElement
  let mockMutationObserver: {
    observe: Mock
    disconnect: Mock
    takeRecords: Mock
  }

  beforeEach(() => {
    mockClassList = {
      contains: vi.fn(),
    }

    mockDocumentElement = {
      classList: mockClassList,
    } as unknown as HTMLElement

    vi.spyOn(window.document, 'documentElement', 'get').mockReturnValue(
      mockDocumentElement,
    )

    mockMutationObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
      takeRecords: vi.fn(),
    }
    vi.spyOn(globalThis, 'MutationObserver').mockImplementation(
      () => mockMutationObserver,
    )
  })

  const renderUseThemeHook = (initialContainsValue: boolean) => {
    mockClassList.contains.mockReturnValue(initialContainsValue)
    return renderHook(() => useTheme())
  }

  const triggerMutationCallback = (attributeName: string) => {
    act(() => {
      const mutationCallback = (globalThis.MutationObserver as Mock).mock
        .calls[0][0]
      mutationCallback([
        {
          type: 'attributes',
          attributeName,
          target: mockDocumentElement,
        },
      ])
    })
  }

  it('should initialize with light theme when dark class is not present', () => {
    const { result } = renderUseThemeHook(false)
    expect(result.current.theme).toBe('light')
  })

  it('should initialize with dark theme when dark class is present', () => {
    const { result } = renderUseThemeHook(true)
    expect(result.current.theme).toBe('dark')
  })

  it.each([
    {
      initialTheme: 'light',
      finalTheme: 'dark',
      initialContains: false,
      finalContains: true,
    },
    {
      initialTheme: 'dark',
      finalTheme: 'light',
      initialContains: true,
      finalContains: false,
    },
  ])(
    'should update theme from $initialTheme to $finalTheme when class changes',
    ({ initialTheme, finalTheme, initialContains, finalContains }) => {
      mockClassList.contains
        .mockReturnValueOnce(initialContains)
        .mockReturnValueOnce(finalContains)

      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe(initialTheme)

      triggerMutationCallback('class')

      expect(result.current.theme).toBe(finalTheme)
    },
  )

  it('should not update theme for non-class attribute changes', () => {
    const { result } = renderUseThemeHook(false)

    expect(result.current.theme).toBe('light')

    triggerMutationCallback('id')

    expect(result.current.theme).toBe('light')
  })

  it('should clean up MutationObserver on unmount', () => {
    const { unmount } = renderUseThemeHook(false)

    unmount()

    expect(mockMutationObserver.disconnect).toHaveBeenCalledTimes(1)
  })
})
