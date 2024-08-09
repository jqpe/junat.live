import { useRouter } from 'next/router'

import { RadioGroup } from '~/components/radio_group'
import { translate, useLocale } from '~/i18n'

export const LanguageToggle = () => {
  const router = useRouter()
  const locale = useLocale()

  return (
    <RadioGroup
      defaultValue={locale}
      values={translate('all')('locale')}
      onValueChange={() => router.replace(router.pathname, 'settings')}
    />
  )
}
