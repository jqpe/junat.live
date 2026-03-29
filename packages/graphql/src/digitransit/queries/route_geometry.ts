import { graphql } from '#generated/digitransit'

export const routeGeometry = graphql(`
  query routeGeometry($id: String!) {
    route(id: $id) {
      patterns {
        patternGeometry {
          points
        }
      }
    }
  }
`)
