import type { MapLayerMouseEvent } from 'react-map-gl/maplibre'
import type { SingleTrainFragment } from '@junat/graphql/digitraffic'

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import polyline from '@mapbox/polyline'
import { cx } from 'cva'
import { Layer, Popup, Source } from 'react-map-gl/maplibre'

import { getTrainTitle } from '@junat/core'
import { getCalendarDate } from '@junat/core/utils/date'
import { useRouteGeometry } from '@junat/react-hooks'
import {
  useTrainLocations,
  useTrainLocationsSubscription,
} from '@junat/react-hooks/digitraffic'
import { useSingleTrain } from '@junat/react-hooks/digitraffic/use_single_train'

import { useTranslations } from '~/i18n'

const TrainSourceComponent = memo(
  ({
    trainGeoJson,
    trainLayer,
    trainLabelLayer,
  }: {
    trainGeoJson: GeoJSON.FeatureCollection<GeoJSON.Point>
    trainLayer: React.ComponentProps<typeof Layer>
    trainLabelLayer: React.ComponentProps<typeof Layer>
  }) => (
    <Source id="trains" type="geojson" data={trainGeoJson}>
      <Layer {...trainLayer} />
      <Layer {...trainLabelLayer} />
    </Source>
  ),
)

TrainSourceComponent.displayName = 'TrainSourceComponent'

const TrainPopup = memo(
  ({
    train,
    onSelectTrain,
    hasSelectedTrain,
  }: {
    train: {
      longitude: number
      latitude: number
      properties: {
        trainNumber: number
        commuterLineId: string
        speed: number
        timestamp: string
        departure: string
        destination: string
        trainType: string
        operatorUicCode: string
      }
    }
    onSelectTrain: () => void
    hasSelectedTrain: boolean
  }) => {
    const t = useTranslations()

    const { trainTitle } = getTrainTitle(
      {
        trainNumber: train.properties.trainNumber!,
        trainType: { name: train.properties.trainType },
      },
      t,
    )

    return (
      <Popup
        longitude={train.longitude}
        latitude={train.latitude}
        closeButton={false}
        closeOnClick={false}
        anchor="bottom"
        offset={10}
      >
        <div className="pointer-events-auto relative">
          {/** Safe zone for pointer */}
          <div className="absolute inset-x-0 -bottom-7 h-5 w-full" />

          <div>
            <strong>{trainTitle}</strong>
          </div>

          <div>{train.properties.speed} km/h</div>

          {!hasSelectedTrain && (
            <button
              onClick={onSelectTrain}
              className={cx(
                'mt-2 w-full rounded bg-primary-500 px-3 py-1 font-ui text-sm',
                'text-white transition-colors hover:bg-primary-600',
              )}
            >
              {t('mapPage.viewTrainSchedule')}
            </button>
          )}
        </div>
      </Popup>
    )
  },
)

TrainPopup.displayName = 'TrainPopup'

export interface TrainLayerHandle {
  onMouseEnter: (event: MapLayerMouseEvent) => void
  onMouseLeave: (event?: MapLayerMouseEvent) => void
  clearSelectedTrain: () => void
  getSelectedTrain: () => {
    trainNumber: number
    trainType?: string
    departureDate: string
    timetableRows: SingleTrainFragment['timeTableRows']
  } | null
}

interface TrainLayerProps {
  onSelectedTrainChange?: (
    train: ReturnType<TrainLayerHandle['getSelectedTrain']>,
  ) => void
}

export const TrainLayer = memo(
  forwardRef<TrainLayerHandle, TrainLayerProps>(function TrainLayer(
    { onSelectedTrainChange },
    ref,
  ) {
    const locationsQuery = useTrainLocations()

    useTrainLocationsSubscription({})

    const [hoveredTrain, setHoveredTrain] = useState<{
      trainNumber: number
    } | null>(null)

    const [selectedTrain, setSelectedTrain] = useState<{
      trainNumber: number
      departureDate: string
      departure?: string
      destination?: string
      commuterLineId?: string | null
      trainType?: string
      operatorUicCode?: string
    } | null>(null)

    const apiKey = process.env.NEXT_PUBLIC_DIGITRANSIT_KEY

    const singleTrainQuery = useSingleTrain({
      trainNumber: selectedTrain?.trainNumber,
      departureDate: selectedTrain?.departureDate,
    })

    const routeGeometryQuery = useRouteGeometry({
      apiKey: apiKey ?? '',
      departure: selectedTrain?.departure,
      destination: selectedTrain?.destination,
      trainNumber: selectedTrain?.trainNumber,
      commuterLineId: selectedTrain?.commuterLineId,
      trainType: selectedTrain?.trainType,
      operatorUicCode: selectedTrain?.operatorUicCode,
      enabled: !!selectedTrain,
    })

    const routeGeoJson = useMemo(() => {
      if (!routeGeometryQuery.data) {
        return null
      }

      try {
        const coordinates = polyline.decode(routeGeometryQuery.data.at(0)!)

        return {
          type: 'FeatureCollection' as const,
          features: [
            {
              type: 'Feature' as const,
              geometry: {
                type: 'LineString' as const,
                // Polyline returns [lat, lng], but GeoJSON uses [lng, lat]
                coordinates: coordinates.map(([lat, lng]: [number, number]) => [
                  lng,
                  lat,
                ]),
              },
              properties: {},
            },
          ],
        }
      } catch (error) {
        console.error('Failed to decode route polyline:', error)
        return null
      }
    }, [routeGeometryQuery.data])

    const trainGeoJson = useMemo(() => {
      if (!locationsQuery.data) {
        return {
          type: 'FeatureCollection' as const,
          features: [],
        }
      }

      const filteredLocations = selectedTrain
        ? locationsQuery.data.filter(
            train => train.train?.trainNumber === selectedTrain.trainNumber,
          )
        : locationsQuery.data

      return {
        type: 'FeatureCollection' as const,
        features: filteredLocations.map(
          ({ train, location, speed, timestamp }) => {
            const journeySections = train?.compositions?.[0]?.journeySections

            return {
              type: 'Feature' as const,
              geometry: {
                type: 'Point' as const,
                coordinates: location,
              },
              properties: {
                trainNumber: train?.trainNumber ?? 0,
                commuterLineId: train?.commuterLineId ?? '',
                speed,
                timestamp,
                departure:
                  journeySections?.at(0)?.startTimeTableRow?.station
                    ?.shortCode ?? train?.firstRow.at(0)?.station?.shortCode,
                destination:
                  journeySections?.at(-1)?.endTimeTableRow?.station
                    ?.shortCode ?? train?.lastRow.at(0)?.station?.shortCode,
                trainType: train?.trainType?.name,
                operatorUicCode: train?.operator?.uicCode?.toString(),
              },
            }
          },
        ),
      }
    }, [locationsQuery.data, selectedTrain])

    const trainLayer = useMemo(
      () =>
        ({
          id: 'trains',
          type: 'circle' as const,
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              8,
              8,
              18,
              18,
            ] as unknown,
            'circle-color': '#000',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
          },
        }) as React.ComponentProps<typeof Layer>,
      [],
    )

    const trainLabelLayer = useMemo(
      () =>
        ({
          id: 'train-labels',
          type: 'symbol' as const,
          layout: {
            'text-field': [
              'case',
              ['!=', ['get', 'commuterLineId'], ''],
              ['get', 'commuterLineId'],
              ['to-string', ['get', 'trainNumber']],
            ],
            'text-size': ['interpolate', ['linear'], ['zoom'], 0, 6, 12, 11],
            'text-font': ['Noto Sans Medium'],
            'text-allow-overlap': true,
            'text-ignore-placement': true,
            'text-overlap': 'cooperative',
          },
          paint: {
            'text-color': '#ffffff',
          },
        }) as React.ComponentProps<typeof Layer>,
      [],
    )

    const routeLayer = useMemo(
      () =>
        ({
          id: 'train-route',
          type: 'line' as const,
          paint: {
            'line-color': '#c779ff', // primary-500
            'line-width': 3,
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          beforeId: 'station-circles',
        }) as React.ComponentProps<typeof Layer>,
      [],
    )

    const emptyGeoJson = useMemo(
      () => ({
        type: 'FeatureCollection' as const,
        features: [],
      }),
      [],
    )

    const handleSelectTrain = useCallback(
      (properties: {
        trainNumber: number
        departure: string
        destination: string
        commuterLineId: string
        trainType: string
        operatorUicCode: string
      }) => {
        const departureDate = getCalendarDate(new Date().toISOString())

        setSelectedTrain({
          trainNumber: properties.trainNumber,
          departureDate,
          departure: properties.departure,
          destination: properties.destination,
          commuterLineId: properties.commuterLineId,
          trainType: properties.trainType,
          operatorUicCode: properties.operatorUicCode,
        })
      },
      [],
    )

    const onMouseEnter = useCallback((event: MapLayerMouseEvent) => {
      if (event.features && event.features.length > 0) {
        const feature = event.features[0]
        if (feature?.geometry.type === 'Point') {
          const canvas = event.target.getCanvas()
          if (canvas) {
            canvas.style.cursor = 'pointer'
          }

          const properties = feature.properties
          if (properties?.trainNumber) {
            setHoveredTrain({
              trainNumber: properties.trainNumber,
            })
          }
        }
      }
    }, [])

    const onMouseLeave = useCallback((event?: MapLayerMouseEvent) => {
      if (event) {
        const canvas = event.target.getCanvas()
        if (canvas) {
          canvas.style.cursor = ''
        }
      }

      setHoveredTrain(null)
    }, [])

    useEffect(() => {
      if (onSelectedTrainChange) {
        const trainData =
          selectedTrain && singleTrainQuery.data
            ? {
                trainNumber: selectedTrain.trainNumber,
                departureDate: selectedTrain.departureDate,
                trainType: selectedTrain.trainType,
                timetableRows: singleTrainQuery.data.timeTableRows,
              }
            : null
        onSelectedTrainChange(trainData)
      }
    }, [selectedTrain, singleTrainQuery.data, onSelectedTrainChange])

    // Get the current location and properties for the hovered train
    const hoveredTrainData = useMemo(() => {
      if (!hoveredTrain || !locationsQuery.data) return null

      const trainLocation = locationsQuery.data.find(
        ({ train }) => train?.trainNumber === hoveredTrain.trainNumber,
      )

      if (!trainLocation) {
        return null
      }

      const { train, location, speed, timestamp } = trainLocation
      const [longitude, latitude] = location

      if (longitude === undefined || latitude === undefined) {
        return null
      }

      const journeySections = train?.compositions?.[0]?.journeySections

      return {
        longitude,
        latitude,
        properties: {
          trainNumber: train?.trainNumber ?? 0,
          commuterLineId: train?.commuterLineId ?? '',
          speed: speed,
          timestamp: timestamp,
          departure:
            journeySections?.at(0)?.startTimeTableRow?.station?.shortCode ??
            train?.firstRow.at(0)?.station?.shortCode ??
            '',
          destination:
            journeySections?.at(-1)?.endTimeTableRow?.station?.shortCode ??
            train?.lastRow.at(0)?.station?.shortCode ??
            '',
          trainType: train?.trainType?.name ?? '',
          operatorUicCode: train?.operator?.uicCode?.toString() ?? '',
        },
      }
    }, [hoveredTrain, locationsQuery.data])

    useImperativeHandle(
      ref,
      () => ({
        onMouseEnter,
        onMouseLeave,
        clearSelectedTrain: () => setSelectedTrain(null),
        getSelectedTrain: () =>
          selectedTrain && singleTrainQuery.data
            ? {
                trainNumber: selectedTrain.trainNumber,
                departureDate: selectedTrain.departureDate,
                trainType: selectedTrain.trainType,
                timetableRows: singleTrainQuery.data.timeTableRows,
              }
            : null,
      }),
      [onMouseEnter, onMouseLeave, selectedTrain, singleTrainQuery.data],
    )

    return (
      <>
        <TrainSourceComponent
          trainGeoJson={trainGeoJson}
          trainLayer={trainLayer}
          trainLabelLayer={trainLabelLayer}
        />
        <Source
          id="train-route"
          type="geojson"
          data={routeGeoJson ?? emptyGeoJson}
        >
          <Layer {...routeLayer} />
        </Source>
        {hoveredTrainData && (
          <TrainPopup
            hasSelectedTrain={!!selectedTrain}
            train={hoveredTrainData}
            onSelectTrain={() => handleSelectTrain(hoveredTrainData.properties)}
          />
        )}
      </>
    )
  }),
)
