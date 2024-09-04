import React, { useEffect } from 'react'
import * as maplibregl from 'maplibre-gl'
import layers from 'protomaps-themes-base'

import { useTheme } from '@junat/react-hooks'

import 'maplibre-gl/dist/maplibre-gl.css'

import type { RouteLayerProps } from './route_layer'

import { singleTimetableFilter } from '@junat/core'

import { RouteLayer } from './route_layer'
import { TimetableStationsLayer } from './station_layer'

interface MapProps {
  train: RouteLayerProps['train']
}

export const Map = (props: MapProps) => {
  const { theme } = useTheme()
  const mapRef = React.useRef<maplibregl.Map>()

  React.useLayoutEffect(() => {
    const map = new maplibregl.Map({
      container: 'map',
      attributionControl: {
        customAttribution: '',
      },
      style: {
        version: 8,
        glyphs: 'https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf',
        sprite: `https://protomaps.github.io/basemaps-assets/sprites/v3/${theme}`,
        sources: {
          protomaps: {
            type: 'vector',
            url: 'https://tiles.junat.live/finland.json',
            attribution:
              '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
          },
        },
        layers: layers('protomaps', theme),
      },
    })

    map
      .addControl(new maplibregl.ScaleControl())
      .addControl(new maplibregl.GeolocateControl({}))
      .addControl(new maplibregl.NavigationControl())
      .addControl(new maplibregl.FullscreenControl())

    mapRef.current = map

    return () => map.remove()
  }, [theme])

  void useJumptoBestLocation(mapRef, props.train)

  const type = 'DEPARTURE'

  return (
    <>
      <div id="map" className="h-full w-full" />
      {mapRef.current && props.train && (
        <>
          <RouteLayer map={mapRef.current} train={props.train} />
          <TimetableStationsLayer
            mapRef={mapRef}
            rows={props.train.timeTableRows.filter(
              singleTimetableFilter(type, props.train.timeTableRows),
            )}
          />
        </>
      )}
    </>
  )
}
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

function useJumptoBestLocation(
  mapRef: React.MutableRefObject<maplibregl.Map | undefined>,
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
