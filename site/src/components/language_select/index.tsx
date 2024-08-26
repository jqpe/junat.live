import { useRouter } from 'next/router'

import { useStationPage } from '@junat/react-hooks/use_station_page'
import { Select } from '@junat/ui/components/select'
import Globe from '@junat/ui/icons/globe.svg'

import { translate, useLocale } from '~/i18n'
import { handleValueChange } from './helpers'

export function LanguageSelect({
  stations,
}: {
  stations: Parameters<typeof handleValueChange>[0]['stations']
}) {
  const currentShortCode = useStationPage(state => state.currentShortCode)

  const locale = useLocale()
  const router = useRouter()

  return (
    <Select
      Icon={<Globe className="fill-gray-200" />}
      items={translate('all')('locale')}
      defaultValue={locale}
      label={translate(locale)('changeLanguage')}
      onValueChange={value => {
        handleValueChange({ currentShortCode, router, stations, value })
      }}
    />
  )
}

export default LanguageSelect
