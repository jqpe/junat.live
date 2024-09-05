import type { MapRef, MapStyle } from 'react-map-gl/maplibre'
import type { RouteLayerProps } from './route_layer'

import React, { useEffect } from 'react'
import layers from 'protomaps-themes-base'

import { useTheme } from '@junat/react-hooks'

import 'maplibre-gl/dist/maplibre-gl.css'

import {
  FullscreenControl,
  GeolocateControl,
  Map as GlMap,
  MapProvider,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl/maplibre'

import { singleTimetableFilter } from '@junat/core'

import { RouteLayer } from './route_layer'
import { TimetableStationsLayer } from './station_layer'

interface MapProps {
  train: RouteLayerProps['train']
}

export const Map = (props: MapProps) => {
  const { theme } = useTheme()
  const mapRef = React.useRef<MapRef>(null)

  void useJumptoBestLocation(mapRef, props.train)

  const type = 'DEPARTURE'
  const layerRows = props.train.timeTableRows.filter(
    singleTimetableFilter(type, props.train.timeTableRows),
  )

  return (
    <MapProvider>
      <GlMap ref={mapRef} mapStyle={createStyle(theme)}>
        <GeolocateControl />
        <ScaleControl />
        <NavigationControl />
        <FullscreenControl />

        <RouteLayer train={props.train} />
        <TimetableStationsLayer rows={layerRows} />
      </GlMap>
    </MapProvider>
  )
}

const createStyle = (theme: string): MapStyle => ({
  version: 8,
  glyphs: 'https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf',
  sprite: `https://protomaps.github.io/basemaps-assets/sprites/v3/${theme}`,
  sources: {
    protomaps: {
      type: 'vector',
      url: 'https://tiles.junat.live/finland.json',
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
    },
  },
  layers: layers('protomaps', theme),
})

const getBestCenter = (train: MapProps['train']) => {
  return (
    train.trainLocations?.[0]?.location ??
    train.compositions?.[0]?.journeySections?.[0]?.startTimeTableRow?.station
      .location ?? [
      train.timeTableRows.at(0)?.longitude,
      train.timeTableRows.at(0)?.latitude,
    ]
  )
}

const getPadding = () =>
  window.innerWidth > 800
    ? { left: 500, bottom: 0, right: 0, top: 0 }
    : undefined

// broken
function useJumptoBestLocation(
  mapRef: React.RefObject<MapRef>,
  train: MapProps['train'],
) {
  useEffect(() => {
    if (!mapRef.current) return
    if (!train) return

    mapRef.current.jumpTo({
      center: getBestCenter(train),
      zoom: 12,
      padding: getPadding(),
    })
  }, [train, mapRef.current])
}
