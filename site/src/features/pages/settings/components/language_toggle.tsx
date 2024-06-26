import type { Locale } from '~/types/common'

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import { translate } from '@junat/locales'
import { RadioGroup } from '~/components/radio_group'
import { ROUTES } from '~/constants/locales'
import { getLocale } from '~/utils/get_locale'

export const LanguageToggle = () => {
  const router = useRouter()
  const locale = getLocale(router.locale)

  return (
    <RadioGroup
      defaultValue={locale}
      values={translate('all')('locale')}
      onValueChange={locale => {
        router.replace(router.pathname, ROUTES[locale as Locale]['settings'], {
          locale
        })

        Cookies.set('NEXT_LOCALE', locale, {
          sameSite: 'Lax',
          secure: true,
          expires: 365
        })
      }}
    />
  )
}
