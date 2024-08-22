import { RadioGroup } from '@junat/ui/components/radio_group'

import { getSupportedLocale, translate, useI18nStore } from '~/i18n'

export const LanguageToggle = () => {
  const [locale, changeLocale] = useI18nStore(state => [
    state.locale,
    state.changeLocale,
  ])

  return (
    <RadioGroup
      defaultValue={locale}
      values={translate('all')('locale')}
      onValueChange={value => changeLocale(getSupportedLocale(value))}
    />
  )
}
