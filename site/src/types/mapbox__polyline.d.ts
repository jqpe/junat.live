/* eslint-disable unicorn/filename-case */
declare module '@mapbox/polyline' {
  export function decode(
    str: string,
    precision?: number,
  ): Array<[number, number]>
  export function encode(
    coordinates: Array<[number, number]>,
    precision?: number,
  ): string
}
