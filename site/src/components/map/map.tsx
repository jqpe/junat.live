import type {
  MapLayerMouseEvent,
  MapRef,
  ViewStateChangeEvent,
} from 'react-map-gl/maplibre'
import type { TrainLayerHandle } from './train_layer'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { layers, namedFlavor } from '@protomaps/basemaps'
import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import GlMap, { ScaleControl } from 'react-map-gl/maplibre'

import { useTheme } from '@junat/react-hooks'
import {
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  useQueryState,
} from '@junat/react-hooks/nuqs'

import { useLocale } from '~/i18n'
import { LayerControl } from './layer_control'
import { RailwayTracksLayer } from './railway_tracks_layer'
import { SelectedTrainPanel } from './selected_train_panel'
import { StationsLayer } from './stations_layer'
import { TrainLayer } from './train_layer'

/* eslint-disable-next-line sonarjs/no-globals-shadowing */
export function Map() {
  const mapRef = useRef<MapRef>(null)
  const [isFollowing, setIsFollowing] = useQueryState('follow', parseAsBoolean)
  const [, setLng] = useQueryState('lng', parseAsFloat.withDefault(24.945_831))
  const [, setLat] = useQueryState('lat', parseAsFloat.withDefault(60.192_059))
  const [, setZoom] = useQueryState('zoom', parseAsInteger.withDefault(12))

  const locale = useLocale()
  const trainLayerRef = useRef<TrainLayerHandle>(null)
  const { theme } = useTheme()
  const [detailed, setDetailed] = useState(false)
  const [selectedTrain, setSelectedTrain] = useState<ReturnType<
    TrainLayerHandle['getSelectedTrain']
  > | null>(null)

  const onTrainPositionChange = useCallback(
    (coords: [number, number] | null) => {
      if (!coords || !mapRef.current) return

      const isMobile = window.innerWidth < 1024

      mapRef.current.easeTo({
        center: coords,
        padding: isMobile ? { bottom: window.innerHeight / 2 } : 0,
      })
    },
    [],
  )

  const onDragStart = useCallback(() => setIsFollowing(null), [setIsFollowing])

  useEffect(() => {
    const protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)

    return () => maplibregl.removeProtocol('pmtiles')
  }, [])

  const onMoveEnd = useCallback(
    (event: ViewStateChangeEvent) => {
      // When in train following mode don't update lng/lat/zoom to avoid re-renders
      // map position is synced programmatically and does not care about lng/lat/zoom at that stage
      // lng lat is set automatically when the user starts dragging which is also cancels following
      if (isFollowing) return

      const { longitude, latitude, zoom } = event.viewState
      setLng(Number.parseFloat(longitude.toFixed(6)))
      setLat(Number.parseFloat(latitude.toFixed(6)))
      setZoom(Math.round(zoom))
    },
    [setLng, setLat, setZoom, isFollowing],
  )

  const mapStyle = useMemo(() => {
    const flavor = theme === 'light' ? 'white' : 'black'

    return {
      version: 8 as const,
      glyphs:
        'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
      sprite: `https://protomaps.github.io/basemaps-assets/sprites/v4/${flavor}`,
      sources: {
        protomaps: {
          type: 'vector' as const,
          tiles: ['https://junat.live/tiles/finland/{z}/{x}/{y}.mvt'],
          maxzoom: 15,
        },
      },
      layers: [...layers('protomaps', namedFlavor(flavor), { lang: locale })],
    }
  }, [locale, detailed, theme])

  const onMouseEnter = useCallback((event: MapLayerMouseEvent) => {
    trainLayerRef.current?.onMouseEnter(event)
  }, [])

  const onMouseLeave = useCallback((event: MapLayerMouseEvent) => {
    trainLayerRef.current?.onMouseLeave(event)
  }, [])

  const onClick = useCallback((event: MapLayerMouseEvent) => {
    trainLayerRef.current?.onClick(event)
  }, [])

  const onSelectedTrainChange = useCallback(
    (
      train: TrainLayerHandle['getSelectedTrain'] extends () => infer R
        ? R
        : never,
    ) => {
      setSelectedTrain(train)
    },
    [],
  )

  const initialViewState = useRef(getInitialViewState())

  return (
    <div className="relative h-dvh w-dvw overflow-clip">
      <GlMap
        ref={mapRef}
        initialViewState={initialViewState.current}
        onMoveEnd={onMoveEnd}
        minZoom={4.5}
        maxZoom={18}
        style={{
          position: 'absolute',
          inset: 0,
          paddingTop: 'var(--header-height)',
        }}
        attributionControl={false}
        mapStyle={mapStyle}
        interactiveLayerIds={['trains']}
        onDragStart={onDragStart}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <StationsLayer selectedTrain={selectedTrain} />
        <RailwayTracksLayer />
        <TrainLayer
          ref={trainLayerRef}
          onSelectedTrainChange={onSelectedTrainChange}
          onTrainPositionChange={onTrainPositionChange}
        />
        <ScaleControl />
        <LayerControl
          detailed={detailed}
          onToggle={() => setDetailed(detailed => !detailed)}
        />
      </GlMap>

      <SelectedTrainPanel
        selectedTrain={selectedTrain}
        onClose={() => {
          trainLayerRef.current?.clearSelectedTrain()
          setSelectedTrain(null)
        }}
      />
    </div>
  )
}

function getInitialViewState() {
  if (typeof window === 'undefined') {
    return { longitude: 24.945_831, latitude: 60.192_059, zoom: 12 }
  }
  const params = new URLSearchParams(window.location.search)
  return {
    longitude: Number.parseFloat(params.get('lng') ?? '24.945831'),
    latitude: Number.parseFloat(params.get('lat') ?? '60.192059'),
    zoom: Number.parseInt(params.get('zoom') ?? '12', 10),
  }
}
