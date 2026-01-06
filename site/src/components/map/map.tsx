/* eslint-disable sonarjs/no-globals-shadowing */

import type { MapLayerMouseEvent } from 'react-map-gl/maplibre'
import type { TrainLayerHandle } from './train_layer'

import { layers, namedFlavor } from '@protomaps/basemaps'
import { Layers, LayersPlus } from 'lucide-react'
import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import GlMap from 'react-map-gl/maplibre'

import { useTheme } from '@junat/react-hooks'

import { useLocale } from '~/i18n'
import { RailwayTracksLayer } from './railway_tracks_layer'
import { StationsLayer } from './stations_layer'
import { TrainLayer } from './train_layer'

export function Map() {
  const locale = useLocale()
  const trainLayerRef = useRef<TrainLayerHandle>(null)
  const { theme } = useTheme()
  const [detailed, setDetailed] = useState(true)

  useEffect(() => {
    const protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)

    return () => maplibregl.removeProtocol('pmtiles')
  }, [])

  const mapStyle = useMemo(() => {
    // eslint-disable-next-line sonarjs/no-nested-conditional
    const flavor = detailed ? theme : theme === 'light' ? 'white' : 'black'

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

  return (
    <>
      <GlMap
        initialViewState={{
          longitude: 24.945_831,
          latitude: 60.192_059,
          zoom: 12,
        }}
        minZoom={4.5}
        maxZoom={18}
        style={{
          width: '100vw',
          height: '100vh',
          paddingTop: 'var(--header-height)',
        }}
        attributionControl={false}
        mapStyle={mapStyle}
        interactiveLayerIds={['trains']}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <RailwayTracksLayer />
        <StationsLayer />
        <TrainLayer ref={trainLayerRef} />
      </GlMap>

      <button
        className="absolute left-2 top-[var(--header-height)] z-20 flex"
        onClick={() => setDetailed(detailed => !detailed)}
      >
        {detailed ? (
          <Layers height={24} width={24} />
        ) : (
          <LayersPlus height={24} width={24} />
        )}
      </button>
    </>
  )
}
