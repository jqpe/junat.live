import { graphql } from '~/generated'

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
      ...StationDetails
    }
  }
`)
