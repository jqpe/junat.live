import type { Locale } from '~/types/common'

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import { ROUTES } from '@junat/core/constants'
import { RadioGroup } from '~/components/radio_group'
import { translate, useLocale } from '~/i18n'

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
