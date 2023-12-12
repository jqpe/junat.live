import { LayerProps, Source } from 'react-map-gl/maplibre'
import { Layer } from 'react-map-gl/maplibre'
import { Train } from '~/lib/digitraffic/queries/single_train'
import { getGtfsid } from '../utils'
import { useRoute } from '~/lib/digitransit/hooks/use_route'

import { theme } from '~/lib/tailwind.css'

const routeLayer: LayerProps = {
  type: 'line',
  id: 'route',
  paint: {
    'line-color': theme.colors.primary[500],
    'line-width': 3,
    'line-opacity': 1
  }
}

export const RouteLayer = ({ train }: { train?: Train | null }) => {
  const id = train
    ? getGtfsid({
        arrivalShortCode: train.compositions?.[0]?.journeySections?.[0]
          ?.endTimeTableRow?.station.shortCode as string,
        departureShortCode: train.compositions?.[0]?.journeySections?.[0]
          ?.startTimeTableRow?.station.shortCode as string,
        operatorShortCode: train.operator.shortCode,
        trainCategory: train.trainCategory,
        trainNumber: train.trainNumber,
        commuterLineId: train.commuterLineId ?? undefined
      })
    : null

  const { data: route } = useRoute({ id })

  const getData = () => {
    if (!route) {
      return
    }

    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route?.[0]?.patterns?.[0]?.geometry?.map(c => [
          c?.lon,
          c?.lat
        ])
      }
    }
  }

  if (!route) {
    return null
  }

  return (
    <Source type="geojson" data={getData()}>
      <Layer {...routeLayer} />
    </Source>
  )
}
