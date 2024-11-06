import type { TranslationBase } from '@junat/core'

import { Content, Portal, Root, Trigger } from '@radix-ui/react-popover'
import { useQuery } from '@tanstack/react-query'
import { cx } from 'cva'

import { fetchWeatherData, weatherDataToJson } from '@junat/weather'

import { useTranslations } from '~/i18n'

interface WeatherBadgeProps {
  station: { stationShortCode: string; latitude: number; longitude: number }
}

const getSymbolTranslationKey = (symbol: number) => {
  return `${symbol > 100 ? symbol - 100 : symbol}` as keyof TranslationBase['symbols']
}

export const WeatherBadge = (props: WeatherBadgeProps) => {
  const { station } = props
  const t = useTranslations()

  const weather = useQuery({
    staleTime: 5000,
    queryKey: ['weather', station.stationShortCode],
    queryFn: async () => {
      const features = await fetchWeatherData({
        latitude: station.latitude,
        longitude: station.longitude,
        time: Date.now(),
      })

      return weatherDataToJson(features)
    },
  })

  const symbolTranslation =
    t('symbols')[getSymbolTranslationKey(weather.data?.SmartSymbol || 1)]

  return (
    weather.data && (
      <Root modal>
        <Trigger asChild>
          <button
            className={cx(
              'flex flex-row items-center justify-center gap-1',
              'mr-3 w-fit cursor-pointer select-none',
            )}
          >
            <span className="whitespace-nowrap">
              {Math.floor(weather.data.temperature!)}°C
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              title={symbolTranslation}
              className="h-8 dark:brightness-200"
              src={`/weather_icons/${weather.data.SmartSymbol}.svg`}
            />
          </button>
        </Trigger>

        <Portal>
          <Content
            className={cx(
              'flex w-[250px] flex-col items-center gap-2 rounded-lg bg-gray-100 p-4 shadow-xl',
              'data-[side=bottom]:animate-slideUpAndFade data-[state=open]:transition-all',
              'dark:bg-gray-800',
            )}
            sideOffset={5}
          >
            <p className="flex max-h-fit gap-4 text-lg font-bold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                title={symbolTranslation}
                className="h-8 dark:brightness-200"
                src={`/weather_icons/${weather.data.SmartSymbol}.svg`}
              />
              {Math.floor(weather.data.temperature!)}°C
            </p>

            <p>{symbolTranslation}</p>

            <hr className="w-full border-b-[0.5px] border-gray-300 dark:border-gray-700" />

            <cite className="text-sm text-gray-700 dark:text-gray-300">
              {t('weatherSource')}
            </cite>
          </Content>
        </Portal>
      </Root>
    )
  )
}
