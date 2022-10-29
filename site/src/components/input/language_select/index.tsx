import type { NextRouter } from 'next/router'
import type { Locale } from '@typings/common'

import translate from '@utils/translate'

import { Select } from '@components/input/select'
import Cookies from 'js-cookie'
import { useStations } from '@hooks/use_stations'
import { useStationPage } from '@hooks/use_station_page'
import { getStationPath } from '@junat/digitraffic/utils'

import { StyledGlobe } from './styles'

export function LanguageSelect({ router }: { router: NextRouter }) {
  const { data: stations } = useStations()
  const currentShortCode = useStationPage(state => state.currentShortCode)

  return (
    <Select
      Icon={<StyledGlobe />}
      items={translate('all')('locale')}
      defaultValue={router.locale}
      onValueChange={value => {
        let path = router.asPath

        const trainRoute = /(tog|train|juna)/

        if (!trainRoute.test(path) && stations && currentShortCode) {
          const station = stations.find(
            s => s.stationShortCode === currentShortCode
          )

          if (station) {
            path = getStationPath(station.stationName[value as Locale])
          }
        }

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

        router.replace(path, path, {
          locale: value,
          scroll: false
        })
      }}
    />
  )
}

export default LanguageSelect
