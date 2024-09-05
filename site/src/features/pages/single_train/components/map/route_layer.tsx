import type { NormalizedTrain } from '@junat/graphql/digitraffic/queries/single_train'

import { Layer, Source } from 'react-map-gl/maplibre'

import { getGtfsId } from '@junat/core/utils/map'
import { useRoute } from '@junat/react-hooks/digitransit/use_route'

import { theme } from '~/lib/tailwind.css'

export interface RouteLayerProps {
  train: NormalizedTrain
}

export const RouteLayer = ({ train }: RouteLayerProps) => {
  const getShortCode = (key: 'endTimeTableRow' | 'startTimeTableRow') => {
    return (
      train.compositions?.[0].journeySections[0][key].station.shortCode ??
      (key === 'startTimeTableRow'
        ? train.timeTableRows.at(0)?.stationShortCode
        : train.timeTableRows.at(-1)?.stationShortCode)
    )
  }

  const id = train
    ? getGtfsId({
        departureShortCode: getShortCode('startTimeTableRow')!,
        arrivalShortCode: getShortCode('endTimeTableRow')!,
        operatorShortCode: train.operator.shortCode,
        uicCode: +train.operator.uicCode,
        trainType: train.trainType,
        commuterLineId: train.commuterLineID,
        trainNumber: train.trainNumber,
      })
    : null

  const { data: route } = useRoute({
    id,
    apiKey: process.env.NEXT_PUBLIC_DIGITRANSIT_KEY!,
  })

  const geometry = route?.[0]?.patterns?.[0]?.geometry

  if (!geometry) return null

  const data: GeoJSON.Feature<GeoJSON.Geometry> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: geometry.map(c => [c?.lon, c?.lat] as [number, number]),
    },
  }

  return (
    <Source type="geojson" data={data}>
      <Layer
        type="line"
        paint={{
          'line-color': theme.colors.primary[500],
          'line-width': 3,
          'line-opacity': 1,
        }}
      />
    </Source>
  )
}
