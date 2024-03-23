import { graphql } from '~/generated/digitransit'

export const route = graphql(`
  query routeForId($id: String) {
    routes(ids: [$id]) {
      gtfsId
      patterns {
        headsign
        geometry {
          lat
          lon
        }
      }
    }
  }
`)
