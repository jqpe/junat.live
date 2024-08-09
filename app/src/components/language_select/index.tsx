import { Select } from '@junat/ui/components/select'
import Globe from '@junat/ui/icons/globe.svg'

import { getSupportedLocale, translate, useI18nStore } from '~/i18n'

export function LanguageSelect() {
  const [locale, changeLocale] = useI18nStore(state => [
    state.locale,
    state.changeLocale,
  ])

  return (
    <Select
      Icon={<Globe className="fill-gray-200" />}
      items={translate('all')('locale')}
      defaultValue={locale}
      label={translate(locale)('changeLanguage')}
      onValueChange={value => changeLocale(getSupportedLocale(value))}
    />
  )
}

export default LanguageSelect
