import type { Locale } from '~/types/common'

import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

import { RadioGroup } from '~/components/radio_group'
import { ROUTES } from '~/constants/locales'
import { useLocale } from '~/i18n'
import { translate } from '~/utils/translate'

export const LanguageToggle = () => {
  const router = useRouter()
  const locale = useLocale()

  return (
    <RadioGroup
      defaultValue={locale}
      values={translate('all')('locale')}
      onValueChange={locale => {
        router.replace(router.pathname, ROUTES[locale as Locale]['settings'], {
          locale,
        })

        Cookies.set('NEXT_LOCALE', locale, {
          sameSite: 'Lax',
          secure: true,
          expires: 365,
        })
      }}
    />
  )
}
