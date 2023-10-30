import * as helpers from '../../helpers/search_bar'

import React, { DetailedReactHTMLElement, InputHTMLAttributes } from 'react'
import ReactDOM from 'react-dom/client'

import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import constants from '~/constants'
import { getStationPath } from '~/lib/digitraffic'

describe('handleFocus', () => {
  it('imports fuse.js', async () => {
    expect(await helpers.handleFocus()).toStrictEqual(await import('fuse.js'))
  })
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('handleSubmit', () => {
  const preventDefault = vi.fn()
  const callback = vi.fn()

  let form: HTMLFormElement
  let input: HTMLInputElement

  const STATIONS = [
    {
      stationName: {
        sv: 'Helsingfors flygplats',
        fi: 'Lentoasema',
        en: 'Helsinki Airport'
      }
    }
  ]

  beforeEach(() => {
    form = document.createElement('form')
    input = document.createElement('input')
    input.value = 'Hel'
    form.appendChild(input)
  })

  it('may return early if stations are empty', () => {
    helpers.handleSubmit(formEvent(form), callback, [], 'en')

    expect(callback).not.toHaveBeenCalledOnce()
  })

  it('may return early if input is empty', () => {
    input.value = ''

    helpers.handleSubmit(formEvent(form), callback, STATIONS, 'en')

    expect(callback).not.toHaveBeenCalledOnce()
  })

  it.each(constants.LOCALES)(
    "calls callback with station if it's included in search results (locale=%s)",
    locale => {
      helpers.handleSubmit(formEvent(form), callback, STATIONS, locale)

      expect(callback).toHaveBeenCalledOnce()

      const path = `/${getStationPath(STATIONS[0]['stationName'][locale])}`

      expect(callback).toHaveBeenCalledWith(path)
    }
  )

  type SubmitEvent = Parameters<typeof helpers.handleSubmit>[0]

  function formEvent<T extends EventTarget & HTMLFormElement>(
    target: T
  ): SubmitEvent {
    return {
      currentTarget: target,
      preventDefault
    }
  }
})

describe('handleChange', () => {
  let ref: React.RefObject<HTMLInputElement>
  let input: DetailedReactHTMLElement<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >

  const callback = vi.fn()

  const STATIONS = [
    {
      stationName: {
        sv: 'Helsingfors flygplats',
        fi: 'Lentoasema',
        en: 'Helsinki Airport'
      }
    },
    {
      stationName: {
        sv: 'Helsingfors',
        fi: 'Helsinki',
        en: 'Helsinki'
      }
    }
  ]

  const root = ReactDOM.createRoot(document.documentElement)

  beforeEach(() => {
    ref = React.createRef<HTMLInputElement>()
    input = React.createElement('input', {
      ref,
      key: 'input',
      defaultValue: ''
    })
    const body = React.createElement('body', {
      children: React.createElement('form', {
        key: 'form',
        children: [input]
      })
    })

    act(() => root.render(body))
  })

  it('may return early if input is undefined', () => {
    helpers.handleChange(ref, STATIONS, 'en', callback)

    expect(callback).not.toHaveBeenCalledOnce()
  })

  it('returns original stations if input is empty', async () => {
    helpers.handleChange(ref, STATIONS, 'en', callback)

    expect(ref.current?.value).toStrictEqual('')

    await vi.waitFor(
      () => {
        expect(callback).toHaveBeenCalledWith(STATIONS)
      },
      {
        interval: 20 // default is 50ms
      }
    )
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
        interval: 20
      }
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
      { interval: 20 }
    )
  })

  it('calls callback with multiple search results', async () => {
    expect(ref.current).toBeDefined()
    act(() => {
      ref.current!.value = 'Helsingfors'
    })

    helpers.handleChange(ref, STATIONS, 'sv', callback)

    await vi.waitFor(
      () => {
        expect(callback).toHaveBeenCalledWith(
          structuredClone(STATIONS).reverse()
        )
      },
      { interval: 20 }
    )
  })
})
