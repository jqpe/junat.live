import { graphql } from '#generated/digitransit'

export const alerts = graphql(`
  query alerts($station: String!) {
    stations(name: $station) {
      stops {
        alerts {
          ...Alert
        }
      }
    }
  }
`)
