import { fetchWithError } from '@junat/digitraffic'
import { GraphQLClient } from 'graphql-request'

export const client = new GraphQLClient(
  'https://rata.digitraffic.fi/api/v2/graphql/graphql',
  { fetch: fetchWithError }
)
