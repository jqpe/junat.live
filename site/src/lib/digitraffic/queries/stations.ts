import { graphql } from '~/generated'

export type Station = {
  stationName: string
  stationShortCode: string
  longitude: number
  latitude: number
  countryCode: string
}

export const stations = graphql(`
  query stations {
    stations(
      where: {
        and: [
          { passengerTraffic: { equals: true } }
          { shortCode: { unequals: "HSI" } }
          { shortCode: { unequals: "HH" } }
          { shortCode: { unequals: "KIA" } }
          { shortCode: { unequals: "KÖ" } }
          { shortCode: { unequals: "LVT" } }
          { shortCode: { unequals: "NLÄ" } }
          { shortCode: { unequals: "PRV" } }
          { shortCode: { unequals: "MVA" } }
        ]
      }
    ) {
      name
      shortCode
      location
      countryCode
    }
  }
`)
