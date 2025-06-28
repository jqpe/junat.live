import React from 'react'

import { useFavorites } from '@junat/react-hooks'
import { RadioGroup } from '@junat/ui/components/radio_group'

import { useTranslations } from '~/i18n'

export const HomeListToggle = () => {
  const [isDefault, setIsDefault] = useFavorites(store => [
    store.homePageDefaultList,
    store.setHomePageDefaultList,
])

  const t = useTranslations()

  return (
    <RadioGroup
      value={`${isDefault}`}
      defaultValue={`${isDefault}`}
      values={{
        false: t('homePage.listDefault.all'),
        true: t('homePage.listDefault.favorites'),
      }}
      onValueChange={value => setIsDefault(value === 'true' ? true : false)}
    />
  )
}
