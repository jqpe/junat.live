import { GraphQLClient } from 'graphql-request'

import { fetchWithError } from '@junat/digitraffic'

export const client = new GraphQLClient(
  'https://rata.digitraffic.fi/api/v2/graphql/graphql',
  { fetch: fetchWithError },
)

export const betaClient = new GraphQLClient(
  'https://rata-beta.digitraffic.fi/api/v2/graphql/graphql',
  { fetch: fetchWithError },
)
