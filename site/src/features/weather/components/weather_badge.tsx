import { useQuery } from '@tanstack/react-query'

import { fetchWeather } from '../utils/fetch_weather'
import Image from 'next/image'

type WeatherBadgeProps = {
  place: string
}

export const WeatherBadge = (props: WeatherBadgeProps) => {
  const fiveMinutes = 1000 * 60 * 5
  const weather = useQuery(
    ['weather', props.place],
    async () => {
      const weather = await fetchWeather({ place: props.place })

      // Query result can not be undefined, use null to indicate absence of result
      if (weather === undefined) {
        return null
      }

      return weather
    },
    { staleTime: fiveMinutes, refetchOnWindowFocus: false }
  )

  const loadingStyle = 'bg-gray-900 animate-pulse'

  if (weather.data === null) {
    return <div />
  }

  return (
    <div
      className={`flex items-center py-1 px-4 border-[1px] rounded-full border-gray-300 dark:border-gray-800 gap-2 ${
        weather.isLoading ? loadingStyle : ''
      }`}
    >
      {weather.isLoading && <div className="h-[28px] w-[61.625px]" />}

      {weather.data && (
        <>
          <span>{Math.round(weather.data.airTemperature)} °C</span>
          <Image
            src={`/smart_symbol/${window.__theme ?? 'light'}/${
              weather.data.smartSymbol
            }.svg`}
            height={24}
            width={24}
            alt=""
          />
        </>
      )}
    </div>
  )
}
