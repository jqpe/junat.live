import { useQuery } from '@tanstack/react-query'

const DIGITRAFFIC_STATUS_URL = 'https://status.digitraffic.fi/api/v2'
const USED_COMPONENTS = new Set<ComponentId>([
  'nfys4zwym2wz' /* Rail MQTT */,
  '2m8xs6g8chhd' /* Rail GraphQL */,
  '9vty2wtf2tdz' /* /api/v1/metadata/stations */
])

export type Status =
  | 'operational'
  | 'under_maintenance'
  | 'partial_outage'
  | 'major_outage'

type ComponentId = string

type Nullable<T> = { [K in keyof T]?: T[K] | undefined | null }

interface Component
  extends Nullable<{
    created_at: string
    updated_at: string
    position: number
    description: string
    showcase: boolean
    start_date: string
    group_id: string
    page_id: string
    group: boolean
    only_show_if_degraded: boolean
  }> {
  id: string
  name: string
  status: Status
}

/**
 * Fetches status of components from status.digitraffic.fi.
 *
 * Returns a god object `rail` that can be used alone to determine if there are any disturbances in the rail APIs.
 *
 * If further context is required, `components` has an entry for all APIs consumed in the lib/digitraffic directory.
 */
export const useDigitrafficApiStatus = () => {
  return useQuery({
    queryKey: ['api-status'],
    queryFn: async () => {
      const result = await fetch(`${DIGITRAFFIC_STATUS_URL}/components.json`)
      const json: { components: Component[] } = await result.json()
      const rail = json.components.find(c => /^rail$/i.test(c.name))
      const components = json.components.filter(c => USED_COMPONENTS.has(c.id))

      return { rail, components }
    }
  })
}
