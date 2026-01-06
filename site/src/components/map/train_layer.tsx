import type { MapLayerMouseEvent } from 'react-map-gl/maplibre'

import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import { Layer, Popup, Source } from 'react-map-gl/maplibre'

import {
  useTrainLocations,
  useTrainLocationsSubscription,
} from '@junat/react-hooks/digitraffic'

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
}

export const TrainLayer = memo(
  forwardRef<TrainLayerHandle>(function TrainLayer(_props, ref) {
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

    const trainGeoJson = useMemo(() => {
      if (!locationsQuery.data) {
        return {
          type: 'FeatureCollection' as const,
          features: [],
        }
      }

      return {
        type: 'FeatureCollection' as const,
        features: locationsQuery.data.map(train => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: train.location,
          },
          properties: {
            trainNumber: train.train?.trainNumber ?? 0,
            commuterLineId: train.train?.commuterLineid ?? '',
            speed: train.speed,
            timestamp: train.timestamp,
          },
        })),
      }
    }, [locationsQuery.data])

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

    const onClick = useCallback(
      (event: MapLayerMouseEvent) => {
        if (event.features && event.features.length > 0) {
          const feature = event.features[0]
          const trainNumber = feature?.properties?.trainNumber
          if (trainNumber) {
            router.push(`/train/${trainNumber}`)
          }
        }
      },
      [router],
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

    useImperativeHandle(
      ref,
      () => ({
        onMouseEnter,
        onMouseLeave,
        onClick,
      }),
      [onMouseEnter, onMouseLeave, onClick],
    )

    return (
      <>
        <TrainSourceComponent
          trainGeoJson={trainGeoJson}
          trainLayer={trainLayer}
          trainLabelLayer={trainLabelLayer}
        />
        {hoveredTrain && <TrainPopup train={hoveredTrain} />}
      </>
    )
  }),
)
