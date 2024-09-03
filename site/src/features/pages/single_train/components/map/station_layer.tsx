import type * as maplibregl from 'maplibre-gl'
import type { Train } from '@junat/digitraffic/types/train'

import React from 'react'

import { getFormattedTime } from '@junat/core'
import { useTheme } from '@junat/react-hooks'
import { useStations } from '@junat/react-hooks/digitraffic/use_stations'

import { LiveEstimate } from '~/components/single_timetable_row/single_timetable_row.stories'
import { translate, useLocale } from '~/i18n'

export interface TimetableStationsLayerProps {
  mapRef: React.MutableRefObject<maplibregl.Map | undefined>
  rows: Pick<
    Train['timeTableRows'][number],
    'scheduledTime' | 'stationShortCode' | 'liveEstimateTime'
  >[]
}

/** Source & layer */
const TIMETABLE_STATIONS_ID = 'timetable-stations'

export const TimetableStationsLayer = (props: TimetableStationsLayerProps) => {
  const stationsQuery = useStations({ t: translate('all') })
  const locale = useLocale()
  const { theme } = useTheme()

  const stations = stationsQuery.data?.filter(station =>
    props.rows
      .map(row => row.stationShortCode)
      .includes(station.stationShortCode),
  )

  const { mapRef } = props

  React.useEffect(() => {
    if (!mapRef.current) return
    if (!stations) return
    const map = mapRef.current

    if (map.getSource(TIMETABLE_STATIONS_ID)) return

    map.once('load', () => {
      map.addSource(TIMETABLE_STATIONS_ID, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: props.rows.map(row => {
            const station = stations.find(
              code => code.stationShortCode === row.stationShortCode,
            )!

            return {
              type: 'Feature',
              properties: {
                name: station!.stationName[locale],
                time: row.liveEstimateTime
                  ? getFormattedTime(row.liveEstimateTime)
                  : getFormattedTime(row.scheduledTime),
              },
              geometry: {
                type: 'Point',
                coordinates: [station.longitude, station.latitude],
              },
            }
          }),
        },
      })

      map.addLayer({
        source: TIMETABLE_STATIONS_ID,
        type: 'symbol',
        id: TIMETABLE_STATIONS_ID,
        paint: {
          'text-color': theme === 'light' ? '#000' : '#fff',
        },
        layout: {
          'text-field': [
            'format',
            ['get', 'name'],
            '\n',
            ['get', 'time'],
          ],
          'text-font': ['Noto Sans Regular'],
          'text-offset': [0, 0],
          'text-variable-anchor': ['left', 'right'],
          'text-size': 14,
        },
      })
    })
  }, [stations, mapRef])

  return null
}
