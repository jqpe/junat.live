import { graphql } from '~/generated'

export const stationFragment = graphql(`
  fragment StationDetails on Station {
    name
    shortCode
    location
    countryCode
  }
`)
