import type { GpsLocation } from '@junat/digitraffic/types/gps_location'
import type { NormalizedTrain } from '@junat/graphql/digitraffic/queries/single_train'

import React from 'react'
import * as turf from '@turf/turf'
import { cx } from 'cva'
import { Layer, Marker, Source } from 'react-map-gl/maplibre'

import { getGtfsId } from '@junat/core/utils/map'
import { useTrainLocationsSubscription } from '@junat/react-hooks/digitraffic/use_train_location'
import { useRoute } from '@junat/react-hooks/digitransit/use_route'

import { theme } from '~/lib/tailwind.css'

export interface RouteLayerProps {
  train: NormalizedTrain
}

export const RouteLayer = ({ train }: RouteLayerProps) => {
  const markerRef = React.useRef<maplibregl.Marker>(null)

  const id = getRouteId(train)

  const { data: route } = useRoute({
    id,
    apiKey: process.env.NEXT_PUBLIC_DIGITRANSIT_KEY!,
  })

  const locations = useTrainLocationsSubscription({
    trainNumber: train.trainNumber,
    departureDate: train.departureDate,
  })

  const location = locations.at(-1)

  const geometry = route?.[0]?.patterns?.[0]?.geometry

  if (!geometry) return null

  const data = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: geometry?.map(c => [c?.lon, c?.lat] as [number, number]),
    },
  } satisfies GeoJSON.Feature<GeoJSON.Geometry>

  const coords = getSnappedPoint(train, location, data.geometry.coordinates)

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
      {coords && (
        <Marker
          ref={markerRef}
          longitude={coords.geometry.coordinates[0]!}
          latitude={coords.geometry.coordinates[1]!}
          anchor="center"
        >
          <div
            className={cx(
              'h-6 w-6 rounded-full bg-gray-900 text-center leading-6',
              'text-gray-100',
            )}
          >
            {train.commuterLineID ?? train.trainNumber}
          </div>
        </Marker>
      )}
    </Source>
  )
}
const getSnappedPoint = (
  train: NormalizedTrain,
  /** If `undefined` defaults to train.trainLocations[0].location */
  recentLocation: GpsLocation | undefined,
  lineStringCoordinates: GeoJSON.Position[],
) => {
  const initialPosition = train.trainLocations?.[0].location

  const long = recentLocation?.location.coordinates[0] ?? initialPosition?.[0]
  const lat = recentLocation?.location.coordinates[1] ?? initialPosition?.[1]

  if (!long || !lat) return null

  return turf.nearestPointOnLine(
    turf.lineString(lineStringCoordinates),
    turf.point([long, lat]),
  )
}

const getRouteId = (train: NormalizedTrain): string | null => {
  const getShortCode = (key: 'endTimeTableRow' | 'startTimeTableRow') => {
    const index = key === 'startTimeTableRow' ? 0 : -1

    const fromJourney =
      train.compositions?.[0].journeySections[0][key].station.shortCode

    const fromRows = train.timeTableRows.at(index)?.stationShortCode

    return fromJourney ?? fromRows
  }

  return train
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
}
