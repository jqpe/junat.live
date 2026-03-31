import type { SingleTrainFragment } from '@junat/graphql/digitraffic'

import { useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'

import { getFormattedTime } from '@junat/core'
import { useTheme } from '@junat/react-hooks'
import { useStations } from '@junat/react-hooks/digitraffic/use_stations'

import { translate, useLocale } from '~/i18n'

interface StationsLayerProps {
  selectedTrain?: {
    trainNumber: number
    departureDate: string
    timetableRows?: SingleTrainFragment['timeTableRows']
  } | null
}

export function StationsLayer({ selectedTrain }: Readonly<StationsLayerProps>) {
  const { theme } = useTheme()
  const locale = useLocale()
  const { data: stations } = useStations({ t: translate('all') })

  const stationsGeoJson = useMemo(() => {
    if (!stations) {
      return {
        type: 'FeatureCollection' as const,
        features: [],
      }
    }

    return {
      type: 'FeatureCollection' as const,
      features: stations
        .filter(s => ('passengerTraffic' in s ? s.passengerTraffic : false))
        .map(station => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [station.longitude, station.latitude],
          },
          properties: {
            name: station.stationName[locale],
            shortCode: station.stationShortCode,
          },
        })),
    }
  }, [stations, locale])

  const trainStationsGeoJson = useMemo(() => {
    // Add a check for selectedTrain.timetableRows
    if (!selectedTrain?.timetableRows || !stations) {
      return {
        type: 'FeatureCollection' as const,
        features: [],
      }
    }

    const trainStationCodes = new Set(
      selectedTrain.timetableRows
        .filter(row => row.station && row.commercialStop)
        .map(row => row.station!.shortCode),
    )

    // Create a map of station codes to timetable information
    const timetableMap = new Map(
      selectedTrain.timetableRows
        .filter(row => row.station && row.commercialStop)
        .map(row => {
          const scheduledTime = getFormattedTime(row.scheduledTime)
          const liveTime = row.liveEstimateTime
            ? getFormattedTime(row.liveEstimateTime)
            : null

          return [
            row.station!.shortCode,
            {
              scheduledTime,
              liveEstimateTime: liveTime,
              displayTime: liveTime || scheduledTime,
              type: row.type,
            },
          ]
        }),
    )

    return {
      type: 'FeatureCollection' as const,
      features: stations
        .filter(s => trainStationCodes.has(s.stationShortCode))
        .map(station => {
          const timetable = timetableMap.get(station.stationShortCode)
          const displayLabel = `${station.stationName[locale]}\n${timetable?.displayTime || ''}`

          return {
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [station.longitude, station.latitude],
            },
            properties: {
              name: station.stationName[locale],
              label: displayLabel,
              shortCode: station.stationShortCode,
              displayTime: timetable?.displayTime || '',
              scheduledTime: timetable?.scheduledTime,
              liveEstimateTime: timetable?.liveEstimateTime,
              type: timetable?.type,
            },
          }
        }),
    }
  }, [
    selectedTrain?.trainNumber,
    selectedTrain?.departureDate,
    selectedTrain?.timetableRows, // Added to dependency array
    stations,
    locale,
  ])

  return (
    <>
      <Source id="stations" type="geojson" data={stationsGeoJson}>
        <Layer
          minzoom={8}
          id="station-circles"
          type="circle"
          paint={{
            'circle-radius': 3,
            'circle-color': theme === 'dark' ? '#000' : '#fff',
            'circle-stroke-width': 1,
            'circle-stroke-color': theme === 'dark' ? '#fff' : '#000',
            'circle-opacity': selectedTrain ? 0.5 : 1,
          }}
        />
        <Layer
          minzoom={8}
          id="station-labels"
          type="symbol"
          layout={{
            'text-field': ['get', 'name'],
            'text-size': 12,
            'text-anchor': 'left',
            'text-offset': [0.5, 0],
            'text-font': ['Noto Sans Regular'],
            'text-optional': true,
          }}
          paint={{
            'text-color': theme === 'dark' ? '#fff' : '#000',
            'text-halo-color': theme === 'dark' ? '#000' : '#fff',
            'text-halo-width': 0.5,
            'text-opacity': selectedTrain ? 0.5 : 1,
          }}
        />
      </Source>

      {selectedTrain?.timetableRows && (
        <Source id="train-stations" type="geojson" data={trainStationsGeoJson}>
          <Layer
            id="train-station-circles"
            type="circle"
            paint={{
              'circle-radius': 3,
              'circle-color': '#fff',
              'circle-stroke-width': 1.5,
              'circle-stroke-color': '#000',
            }}
          />
          <Layer
            id="train-station-labels"
            type="symbol"
            beforeId='train-station-circles'
            layout={{
              'text-field': ['get', 'label'],
              'text-size': 12,
              'text-anchor': 'left',
              'text-offset': [0.7, 0],
              'text-font': ['Noto Sans Regular'],
              'text-optional': true,
            }}
            paint={
              {
                'text-color': theme === 'dark' ? 'white' : 'black',
                'text-halo-color': theme === 'dark' ? '#000' : '#fff',
                'text-halo-width': 0.5,
              } as never
            }
          />
        </Source>
      )}
    </>
  )
}
