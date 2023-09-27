import type { NextRouter } from 'next/router'

import translate from '@utils/translate'

import { Select } from '@components/input/select'
import { useStationPage } from '@hooks/use_station_page'

import { getLocale } from '@utils/get_locale'

import { StyledGlobe } from './styles'
import { handleValueChange } from './helpers'

export function LanguageSelect({
  router,
  stations
}: {
  router: NextRouter
  stations: Parameters<typeof handleValueChange>[0]['stations']
}) {
  const currentShortCode = useStationPage(state => state.currentShortCode)

  const locale = getLocale(router.locale)

  return (
    <Select
      Icon={<StyledGlobe />}
      items={translate('all')('locale')}
      defaultValue={router.locale}
      label={translate(locale)('changeLanguage')}
      onValueChange={value => {
        handleValueChange({ currentShortCode, router, stations, value })
      }}
    />
  )
}

export default LanguageSelect
