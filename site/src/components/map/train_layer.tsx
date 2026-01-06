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
import { useRouter } from 'next/router'
import polyline from '@mapbox/polyline'
import { Layer, Popup, Source } from 'react-map-gl/maplibre'

import { getCalendarDate } from '@junat/core/utils/date'
import { useRouteGeometry } from '@junat/react-hooks'
import {
  useTrainLocations,
  useTrainLocationsSubscription,
} from '@junat/react-hooks/digitraffic'
import { useSingleTrain } from '@junat/react-hooks/digitraffic/use_single_train'

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
  }: {
    train: {
      longitude: number
      latitude: number
      properties: {
        trainNumber: number
        commuterLineId: string
        speed: number
        timestamp: string
      }
    }
  }) => (
    <Popup
      longitude={train.longitude}
      latitude={train.latitude}
      closeButton={false}
      closeOnClick={false}
      anchor="bottom"
      offset={10}
    >
      <div className="pointer-events-none select-none">
        <div>
          <strong>
            {train.properties.commuterLineId} {train.properties.trainNumber}
          </strong>
        </div>

        <div>{train.properties.speed} km/h</div>
      </div>
    </Popup>
  ),
)

TrainPopup.displayName = 'TrainPopup'

export interface TrainLayerHandle {
  onMouseEnter: (event: MapLayerMouseEvent) => void
  onMouseLeave: (event?: MapLayerMouseEvent) => void
  onClick: (event: MapLayerMouseEvent) => void
  getSelectedTrain: () => {
    trainNumber: number
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
    const router = useRouter()

    useTrainLocationsSubscription({})

    const [hoveredTrain, setHoveredTrain] = useState<{
      longitude: number
      latitude: number
      properties: {
        trainNumber: number
        commuterLineId: string
        speed: number
        timestamp: string
      }
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
                speed: speed,
                timestamp: timestamp,
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
            ] as unknown,
            'text-size': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              0,
              12,
              11,
            ] as unknown,
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

    const onClick = useCallback(
      (event: MapLayerMouseEvent) => {
        if (event.features && event.features.length > 0) {
          const feature = event.features[0]
          const properties = feature?.properties

          if (properties?.trainNumber) {
            // If clicking the same train, deselect it
            if (selectedTrain?.trainNumber === properties.trainNumber) {
              setSelectedTrain(null)
            } else {
              // Use current date if departureDate is not available
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
            }
          }
        }
      },
      [router, selectedTrain],
    )

    const onMouseEnter = useCallback((event: MapLayerMouseEvent) => {
      if (event.features && event.features.length > 0) {
        const feature = event.features[0]
        if (feature?.geometry.type === 'Point') {
          const [longitude, latitude] = feature.geometry.coordinates
          if (longitude !== undefined && latitude !== undefined) {
            const canvas = event.target.getCanvas()
            if (canvas) {
              canvas.style.cursor = 'pointer'
            }

            setHoveredTrain({
              longitude,
              latitude,
              properties: feature.properties as {
                trainNumber: number
                commuterLineId: string
                speed: number
                timestamp: string
              },
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
                timetableRows: singleTrainQuery.data.timeTableRows,
              }
            : null
        onSelectedTrainChange(trainData)
      }
    }, [selectedTrain, singleTrainQuery.data, onSelectedTrainChange])

    useImperativeHandle(
      ref,
      () => ({
        onMouseEnter,
        onMouseLeave,
        onClick,
        getSelectedTrain: () =>
          selectedTrain && singleTrainQuery.data
            ? {
                trainNumber: selectedTrain.trainNumber,
                departureDate: selectedTrain.departureDate,
                timetableRows: singleTrainQuery.data.timeTableRows,
              }
            : null,
      }),
      [
        onMouseEnter,
        onMouseLeave,
        onClick,
        selectedTrain,
        singleTrainQuery.data,
      ],
    )

    return (
      <>
        <TrainSourceComponent
          trainGeoJson={trainGeoJson}
          trainLayer={trainLayer}
          trainLabelLayer={trainLabelLayer}
        />
        {routeGeoJson && (
          <Source id="train-route" type="geojson" data={routeGeoJson}>
            <Layer {...routeLayer} />
          </Source>
        )}
        {hoveredTrain && <TrainPopup train={hoveredTrain} />}
      </>
    )
  }),
)
