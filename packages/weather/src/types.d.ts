/* eslint-disable @typescript-eslint/no-unused-vars */

interface Feature {
  Location: { Point: { pos: string } }
  Time: string
  ParameterName: 'temperature' | 'WindSpeedMS' | 'SmartSymbol'
  ParameterValue: number
}

declare module 'fast-xml-parser' {
  export class XMLParser {
    constructor(...args: unknown[]) {}

    parse(xml: string) {
      return { FeatureCollection: { member: <{ BsWfsElement: Feature }[]>[] } }
    }
  }
}
