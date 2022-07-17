import { describe, it, expect } from 'vitest'

import { interpolateObject } from '../../src/utils/interpolate_object'

describe('interpolate object', () => {
  it('interpolates an object with single key', () => {
    const beerSong = interpolateObject(
      {
        lyrics:
          '99 bottles of {{ beverage }} on the wall, 99 bottles of {{ beverage }}'
      },
      { beverage: 'beer' }
    )

    expect(beerSong.lyrics).toStrictEqual(
      '99 bottles of beer on the wall, 99 bottles of beer'
    )
  })

  it('interpolates an object with multiple keys in a value', () => {
    const juiceSong = interpolateObject(
      {
        lyrics:
          '99 bottles of {{ juice1 }} on the wall, 99 bottles of {{ juice2 }}?'
      },
      { juice1: 'orange juice', juice2: 'apple juice' }
    )

    expect(juiceSong.lyrics).toStrictEqual(
      '99 bottles of orange juice on the wall, 99 bottles of apple juice?'
    )
  })

  it('interpolates an object with multiple keys', () => {
    const juiceSong = interpolateObject(
      {
        movie: 'Candyman',
        review: '{{ author }}: {{ title }} -- {{ review }}'
      },
      {
        title: 'Awful',
        review: 'No likeable characters.',
        author: 'elliotjeory'
      }
    )

    expect(juiceSong.movie).toStrictEqual('Candyman')

    expect(juiceSong.review).toStrictEqual(
      'elliotjeory: Awful -- No likeable characters.'
    )
  })

  it('returns unaltered base if base object value is not a string', () => {
    const addition = 1

    expect(interpolateObject({ addition }, { x: 1 })).toStrictEqual({
      addition
    })
  })
})
