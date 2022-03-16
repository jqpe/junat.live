import { interpolateString } from '../../src/utils/interpolate_string'

import { describe, expect, it } from 'vitest'

describe('interpolate string', () => {
  it('takes a string and replaces {{ key }} with key in provided object', () => {
    const stationName = 'Ahola'
    const interpolated = interpolateString('{{ stationName }}', { stationName })

    expect(interpolated).toStrictEqual(stationName)
  })

  it('works with multiple keys', () => {
    const [x, y] = [0, 1]
    const interpolated = interpolateString('{{ x }} met {{ y }}.', { x, y })

    expect(interpolated).toStrictEqual(`${x} met ${y}.`)
  })

  it('works without whitespace around the value in curly brackets', () => {
    const stationName = 'Helsinki'
    const interpolated = interpolateString('Next up: {{stationName}}', {
      stationName
    })

    expect(interpolated).toStrictEqual(`Next up: ${stationName}`)
  })

  it('works with redundant keys that are not present on the string', () => {
    const xyz = { x: 'X', y: 'Y', z: 'Z' }

    expect(interpolateString('{{ x }}-men', xyz)).toStrictEqual('X-men')
  })

  it('interpolates multiple keys in string', () => {
    const x = 6
    const interpolated = interpolateString('{{ x }}{{ x }}{{ x }}, oh god.', {
      x
    })

    expect(interpolated).toStrictEqual('666, oh god.')
  })

  it("returns the original string without modifications if object is undefined and string doesn't have curly brackets", () => {
    //@ts-expect-error Second parameter (the object) is expected to be present.
    const interpolated = interpolateString('string')

    expect(interpolated).toStrictEqual('string')
  })

  it('throws if string is not defined', () => {
    // @ts-expect-error Missing arguments string and object.
    expect(() => interpolateString()).toThrow()
  })

  it('removes a key in string to interpolate if key in object is undefined', () => {
    const interpolated = interpolateString('Shall we go on a trip{{ to }}?', {
      to: undefined
    })

    expect(interpolated).toStrictEqual('Shall we go on a trip?')
  })

  it('throws if string is not typeof string', () => {
    expect(() =>
      // @ts-expect-error An array is not of type string
      interpolateString(['wee {{ error }}'], {
        error: undefined
      })
    ).toThrow()
  })
})
