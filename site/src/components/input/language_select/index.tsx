import type { NextRouter } from 'next/router'

import translate from '@utils/translate'

import { Select } from '@components/input/select'
import { useStations } from '@hooks/use_stations'
import { useStationPage } from '@hooks/use_station_page'

import { StyledGlobe } from './styles'
import { handleValueChange } from './helpers'

export function LanguageSelect({ router }: { router: NextRouter }) {
  const { data: stations = [] } = useStations()
  const currentShortCode = useStationPage(state => state.currentShortCode)

  return (
    <Select
      Icon={<StyledGlobe />}
      items={translate('all')('locale')}
      defaultValue={router.locale}
      onValueChange={value => {
        handleValueChange({ currentShortCode, router, stations, value })
      }}
    />
  )
}

export default LanguageSelect
