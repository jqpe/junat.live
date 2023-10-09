import { useQuery } from '@tanstack/react-query'

const DIGITRAFFIC_STATUS_URL = 'https://status.digitraffic.fi/api/v2'
// These are parsed from https://status.digitraffic.fi/api/v2/components.json.
const USED_COMPONENTS = {
  nfys4zwym2wz: 'rail_mqtt',
  '2m8xs6g8chhd': 'rail_graphql',
  '9vty2wtf2tdz': 'rail_metadata_stations'
} as const
const USED_COMPONENTS_IDS = <(keyof typeof USED_COMPONENTS)[]>(
  Object.keys(USED_COMPONENTS)
)

type UsedComponentId = (typeof USED_COMPONENTS_IDS)[number]
type UsedComponentName = (typeof USED_COMPONENTS)[UsedComponentId]

type ComponentRecord = Record<
  (typeof USED_COMPONENTS)[keyof typeof USED_COMPONENTS],
  Component
>

export type Status =
  | 'operational'
  | 'under_maintenance'
  | 'partial_outage'
  | 'major_outage'

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
 * Upon succesful request `components` has an entry for all APIs consumed in the lib/digitraffic directory.
 */
export const useDigitrafficApiStatus = () => {
  // See https://status.digitraffic.fi/api/v2 for documentation about the API.
  return useQuery({
    queryKey: ['digitraffic-api-status'],
    queryFn: fetchApiStatus
  })
}

export const fetchApiStatus = async () => {
  const result = await fetch(`${DIGITRAFFIC_STATUS_URL}/summary.json`)
  const json: { components: Component[] } = await result.json()

  const components = <ComponentRecord>Object.fromEntries(
    json.components
      .filter(component => {
        return (USED_COMPONENTS_IDS as string[]).includes(component.id)
      })
      .map<[UsedComponentName, Component]>(component => {
        return [USED_COMPONENTS[component.id as UsedComponentId], component]
      })
  )

  return { components }
}
