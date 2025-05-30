import type { Locale } from '~/types/common'

import * as React from 'react'
import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as helpers from './helpers'

describe('handleFocus', () => {
  it('imports fuse.js', async () => {
    expect(await helpers.handleFocus()).toStrictEqual(await import('fuse.js'))
  })
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('handleChange', () => {
  let ref: React.RefObject<HTMLInputElement>

  const callback = vi.fn()

  const STATIONS = [
    {
      stationName: {
        fi: 'Lentoasema',
        en: 'Helsinki Airport',
      } as Record<Locale, string>,
    },
    {
      stationName: {
        fi: 'Helsinki',
        en: 'Helsinki',
      } as Record<Locale, string>,
    },
  ]

  beforeEach(() => {
    ref = React.createRef() as React.RefObject<HTMLInputElement>

    render(
      <form>
        <input ref={ref} defaultValue="" />
      </form>,
    )
  })

  it('may return early if input is undefined', () => {
    helpers.handleChange(ref, STATIONS, 'en', callback)

    expect(callback).not.toHaveBeenCalledOnce()
  })

  it('returns original stations if input is empty', async () => {
    helpers.handleChange(ref, STATIONS, 'en', callback)

    expect(ref.current?.value).toStrictEqual('')

    await vi.waitFor(() => expect(callback).toHaveBeenCalledWith(STATIONS), {
      interval: 20, // default is 50ms
    })
  })

  it('may return an empty array if there are no results', async () => {
    expect(ref.current).toBeDefined()
    act(() => {
      ref.current!.value = '0000'
    })
    expect(ref.current?.value).toStrictEqual('0000')

    helpers.handleChange(ref, STATIONS, 'en', callback)
    expect(ref.current!.value).toStrictEqual('0000')

    await vi.waitFor(
      () => {
        expect(callback).toHaveBeenCalledWith([])
      },
      {
        interval: 20,
      },
    )
  })

  it('calls callback with single search result', async () => {
    expect(ref.current).toBeDefined()
    act(() => {
      ref.current!.value = 'Helsinki Airport'
    })

    helpers.handleChange(ref, STATIONS, 'en', callback)

    await vi.waitFor(
      () => {
        expect(callback).toHaveBeenCalledWith([STATIONS[0]])
      },
      { interval: 20 },
    )
  })

  it('calls callback with multiple search results', async () => {
    expect(ref.current).toBeDefined()
    act(() => {
      ref.current!.value = 'Helsinki'
    })

    helpers.handleChange(ref, STATIONS, 'en', callback)

    await vi.waitFor(
      () => {
        expect(callback).toHaveBeenCalledWith(
          structuredClone(STATIONS).reverse(),
        )
      },
      { interval: 20 },
    )
  })
})
