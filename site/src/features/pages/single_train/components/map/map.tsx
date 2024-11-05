import type { MapRef, MapStyle } from 'react-map-gl/maplibre'
import type { RouteLayerProps } from './route_layer'

import React from 'react'
import layers from 'protomaps-themes-base'

import { useTheme } from '@junat/react-hooks'

import 'maplibre-gl/dist/maplibre-gl.css'

import type { Locale } from '@junat/core/types'

import {
  FullscreenControl,
  GeolocateControl,
  Map as GlMap,
  MapProvider,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl/maplibre'

import { singleTimetableFilter } from '@junat/core'

import { useLocale } from '~/i18n'
import { RouteLayer } from './route_layer'
import { TimetableStationsLayer } from './station_layer'

interface MapProps {
  train: RouteLayerProps['train']
}

export const Map = React.memo<MapProps>(
  props => {
    const { theme } = useTheme()
    const locale = useLocale()
    const mapRef = React.useRef<MapRef>(null)

    const type = 'DEPARTURE'
    const layerRows = props.train.timeTableRows.filter(
      singleTimetableFilter(type, props.train.timeTableRows),
    )
    const center = getBestCenter(props.train)

    return (
      <MapProvider>
        <GlMap
          ref={mapRef}
          initialViewState={{
            latitude: center[1],
            longitude: center[0],
            zoom: 12,
            padding: getPadding(),
          }}
          mapStyle={createStyle(theme, locale)}
        >
          <GeolocateControl />
          <ScaleControl />
          <NavigationControl />
          <FullscreenControl />

          <RouteLayer train={props.train} />
          <TimetableStationsLayer rows={layerRows} />
        </GlMap>
      </MapProvider>
    )
  },
  (prev, next) => Object.is(prev.train, next.train),
)

const createStyle = (theme: string, locale: Locale): MapStyle => ({
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
  layers: layers('protomaps', theme, locale),
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
