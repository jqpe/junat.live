import { graphql } from '#generated/digitraffic'

export const alert = graphql(`
  fragment Alert on Alert {
    alertHeaderText
    alertDescriptionText
    alertUrl
    id
    alertSeverityLevel
    effectiveStartDate
    effectiveEndDate
  }
`)
