import type { NextRouter } from 'next/router'
import type { Locale } from '~/types/common'

import Cookies from 'js-cookie'

import { getSupportedLocale } from '~/i18n'
import { getStationPath } from '~/lib/digitraffic'
import { translate } from '~/utils/translate'

type Router = Pick<NextRouter, 'asPath' | 'replace' | 'locale'>

export type OnValueChange = ({
  currentShortCode,
  router,
  stations,
  value,
}: {
  currentShortCode?: string
  router: Router
  stations: {
    stationShortCode: string
    stationName: { [K in Locale]: string }
  }[]
  value: string
}) => void

/**
 * Reloads the page with a new locale (`value`) while respecting localized routes.
 */
export const handleValueChange: OnValueChange = ({
  router,
  value,
  currentShortCode,
  stations,
}) => {
  let path = router.asPath

  const trainPaths = Object.values<string>(translate('all')('train'))
    .map(trainPath => getStationPath(trainPath))
    .join('|')

  const trainRoute = new RegExp(`(${trainPaths})`)

  if (trainRoute.test(path)) {
    const localizedTrain = (locale: Locale) => {
      return getStationPath(translate(locale)('train'))
    }

    path = path.replace(
      localizedTrain(router.locale as Locale),
      localizedTrain(value as Locale),
    )
  }

  Cookies.set('NEXT_LOCALE', value, {
    sameSite: 'Lax',
    secure: true,
    expires: 365,
  })

  const station = stations.find(
    ({ stationShortCode }) => stationShortCode === currentShortCode,
  )

  if (currentShortCode !== undefined && station) {
    path = path.replace(
      getStationPath(station.stationName[getSupportedLocale(router.locale)]),
      getStationPath(station.stationName[value as Locale]),
    )
  }

  router.replace(path, undefined, {
    locale: value,
    scroll: false,
  })
}
