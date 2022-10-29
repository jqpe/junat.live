import type { NextRouter } from 'next/router'
import type { Locale } from '@typings/common'

import Cookies from 'js-cookie'

import { getStationPath } from '@junat/digitraffic/utils'

import translate from '@utils/translate'

type Router = Pick<NextRouter, 'asPath' | 'replace' | 'locale'>

export type OnValueChange = ({
  currentShortCode,
  router,
  stations,
  value
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
 * 
 */
export const handleValueChange: OnValueChange = ({ router, value }) => {
  let path = router.asPath

  const trainRoute = /(tog|train|juna)/

  if (trainRoute.test(path)) {
    const localizedTrain = (locale: Locale) => {
      return getStationPath(translate(locale)('train'))
    }

    path = path.replace(
      localizedTrain(router.locale as Locale),
      localizedTrain(value as Locale)
    )
  }

  Cookies.set('NEXT_LOCALE', value, {
    sameSite: 'strict',
    expires: 365
  })

  router.replace(path, undefined, {
    locale: value,
    scroll: false
  })
}
