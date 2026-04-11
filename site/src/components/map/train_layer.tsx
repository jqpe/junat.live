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
import { Layer, Source } from 'react-map-gl/maplibre'

import { getCalendarDate } from '@junat/core/utils/date'
import { useRouteGeometry } from '@junat/react-hooks'
import {
  useTrainLocations,
  useTrainLocationsSubscription,
} from '@junat/react-hooks/digitraffic'
import { useBestTrain } from '@junat/react-hooks/digitraffic/use_best_train'
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from '@junat/react-hooks/nuqs'

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

export interface TrainLayerHandle {
  onClick: (event: MapLayerMouseEvent) => void
  onMouseEnter: (event: MapLayerMouseEvent) => void
  onMouseLeave: (event?: MapLayerMouseEvent) => void
  clearSelectedTrain: () => void
  getSelectedTrain: () => {
    trainNumber: number
    trainType?: string
    departureDate: string
    timetableRows?: SingleTrainFragment['timeTableRows']
    speed: number | null
  } | null
}

interface TrainProperties {
  trainNumber: number
  departureDate: string
  commuterLineId: string
  speed: number
  timestamp: string
  departure: string
  destination: string
  trainType: string
  operatorUicCode: string
}

interface TrainLayerProps {
  onSelectedTrainChange?: (
    train: ReturnType<TrainLayerHandle['getSelectedTrain']>,
  ) => void
  onTrainPositionChange?: (coords: [number, number] | null) => void
}

export const TrainLayer = memo(
  forwardRef<TrainLayerHandle, TrainLayerProps>(function TrainLayer(
    { onSelectedTrainChange, onTrainPositionChange },
    ref,
  ) {
    const locationsQuery = useTrainLocations()
    const [isFollowing, setIsFollowing] = useQueryState(
      'follow',
      parseAsBoolean,
    )

    useTrainLocationsSubscription({})

    const [urlParams, setUrlParams] = useQueryStates({
      train: parseAsInteger,
      date: parseAsString
        .withDefault(getCalendarDate(new Date().toISOString()))
        .withOptions({ clearOnDefault: false }),
    })

    const [trainData, setTrainData] = useState<{
      departure?: string
      destination?: string
      commuterLineId?: string | null
      trainType?: string
      operatorUicCode?: string
    } | null>(null)

    const selectedTrain = urlParams.train
      ? {
          trainNumber: urlParams.train,
          departureDate: urlParams.date,
          ...trainData,
        }
      : null

    useEffect(() => {
      if (
        selectedTrain?.trainNumber &&
        !selectedTrain.trainType &&
        locationsQuery.data
      ) {
        const trainLocation = locationsQuery.data.find(
          ({ train }) => train?.trainNumber === selectedTrain.trainNumber,
        )

        if (trainLocation?.train) {
          const { train } = trainLocation
          const journeySections = train.compositions?.[0]?.journeySections

          setTrainData({
            departure:
              journeySections?.at(0)?.startTimeTableRow?.station?.shortCode ??
              train.firstRow?.at(0)?.station?.shortCode,
            destination:
              journeySections?.at(-1)?.endTimeTableRow?.station?.shortCode ??
              train.lastRow?.at(0)?.station?.shortCode,
            commuterLineId: train.commuterLineId,
            trainType: train.trainType?.name,
            operatorUicCode: train.operator?.uicCode?.toString(),
          })
        }
      }
    }, [selectedTrain?.trainNumber, locationsQuery.data])

    const apiKey = process.env.NEXT_PUBLIC_DIGITRANSIT_KEY

    const { train } = useBestTrain(
      selectedTrain?.departureDate,
      selectedTrain?.trainNumber,
    )

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
                departureDate:
                  train?.departureDate ??
                  getCalendarDate(new Date().toISOString()),
                departure:
                  (journeySections?.at(0)?.startTimeTableRow?.station
                    ?.shortCode ??
                    train?.firstRow.at(0)?.station?.shortCode) ||
                  '',
                destination:
                  (journeySections?.at(-1)?.endTimeTableRow?.station
                    ?.shortCode ??
                    train?.lastRow.at(0)?.station?.shortCode) ||
                  '',
                trainType: train?.trainType?.name || '',
                operatorUicCode: train?.operator?.uicCode?.toString() || '0',
              } satisfies TrainProperties,
            }
          },
        ),
      }
    }, [locationsQuery.data, selectedTrain])

    useEffect(() => {
      if (!selectedTrain || !locationsQuery.data) {
        onTrainPositionChange?.(null)
        return
      }

      const match = locationsQuery.data.find(
        ({ train }) => train?.trainNumber === selectedTrain.trainNumber,
      )

      if (match?.location && isFollowing) {
        onTrainPositionChange?.(match.location as [number, number])
      }
    }, [selectedTrain, locationsQuery.data, onTrainPositionChange, isFollowing])

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
            'text-overlap': 'always',
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
            // Primary 500
            'line-color': '#c779ff',
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
        departureDate: string
        departure: string
        destination: string
        commuterLineId: string
        trainType: string
        operatorUicCode: string
      }) => {
        setUrlParams({
          train: properties.trainNumber,
          date: properties.departureDate,
        })
        setIsFollowing(true)
        setTrainData({
          departure: properties.departure,
          destination: properties.destination,
          commuterLineId: properties.commuterLineId,
          trainType: properties.trainType,
          operatorUicCode: properties.operatorUicCode,
        })
      },
      [setUrlParams, setIsFollowing],
    )

    const onMouseEnter = useCallback((event: MapLayerMouseEvent) => {
      if (event.features && event.features.length > 0) {
        const feature = event.features[0]
        if (feature?.geometry.type === 'Point') {
          const canvas = event.target.getCanvas()
          if (canvas) canvas.style.cursor = 'pointer'
        }
      }
    }, [])

    const onMouseLeave = useCallback((event?: MapLayerMouseEvent) => {
      if (event) {
        const canvas = event.target.getCanvas()
        if (canvas) canvas.style.cursor = ''
      }
    }, [])

    useEffect(() => {
      if (onSelectedTrainChange) {
        const match = locationsQuery.data?.find(
          ({ train }) => train?.trainNumber === selectedTrain?.trainNumber,
        )

        const trainData = selectedTrain
          ? {
              trainNumber: selectedTrain.trainNumber,
              departureDate: selectedTrain.departureDate,
              trainType: selectedTrain.trainType,
              timetableRows: train?.timeTableRows,
              speed: match?.speed ?? null,
            }
          : null
        onSelectedTrainChange(trainData)
      }
    }, [selectedTrain, train, onSelectedTrainChange, locationsQuery.data])

    const onClick = useCallback(
      (event: MapLayerMouseEvent) => {
        if (event.features && event.features.length > 0) {
          const feature = event.features[0]
          if (
            feature?.geometry.type === 'Point' &&
            feature.properties?.trainNumber
          ) {
            handleSelectTrain(feature.properties! as TrainProperties)
          }
        }
      },
      [handleSelectTrain],
    )

    useImperativeHandle(
      ref,
      () => ({
        onClick,
        onMouseEnter,
        onMouseLeave,
        clearSelectedTrain: () => {
          setUrlParams({ date: null, train: null })
          setIsFollowing(null)
        },
        getSelectedTrain: () => {
          if (!selectedTrain) return null

          const match = locationsQuery.data?.find(
            ({ train }) => train?.trainNumber === selectedTrain.trainNumber,
          )

          return {
            trainNumber: selectedTrain.trainNumber,
            departureDate: selectedTrain.departureDate,
            trainType: selectedTrain.trainType,
            timetableRows: train?.timeTableRows,
            speed: match?.speed ?? null,
          }
        },
      }),
      [
        onClick,
        onMouseEnter,
        onMouseLeave,
        selectedTrain,
        train,
        locationsQuery.data,
      ],
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
      </>
    )
  }),
)
