import { fetchApiStatus } from '~/lib/digitraffic'

import { it, expect } from 'vitest'

it('works', async () => {
  expect(fetchApiStatus()).resolves.and.not.toThrow()
})

it('has expected keys', async () => {
  const status = await fetchApiStatus()

  expect(status.components.rail_graphql).toBeDefined()
  expect(status.components.rail_metadata_stations).toBeDefined()
  expect(status.components.rail_mqtt).toBeDefined()
})

it('components report status', async () => {
  const status = await fetchApiStatus()

  expect(status.components.rail_graphql.status).oneOf([
    'operational',
    'under_maintenance',
    'partial_outage',
    'major_outage'
  ])
})

// Incomplete: we're not testing other keys returned  by the actual API (https://status.digitraffic.fi/api/v2/summary.json)
// This includes page, incidents, scheduled_maintenances and status
it('returns expected keys', async () => {
  const status = await fetchApiStatus()

  expect(Object.keys(status)).have.members(['components'])
})
