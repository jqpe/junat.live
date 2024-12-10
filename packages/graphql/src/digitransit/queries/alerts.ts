import { graphql } from '#generated/digitransit'

export const alerts = graphql(`
  query alerts($station: String!) {
    stations(name: $station) {
      alerts {
        alertHash
      }

      stops {
        alerts {
          ...Alert
        }
      }
    }
  }
`)
