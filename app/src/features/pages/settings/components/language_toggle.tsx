import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

import { RadioGroup } from '~/components/radio_group'
import { translate, useLocale, useTranslations } from '~/i18n'

export const LanguageToggle = () => {
  const router = useRouter()
  const t = useTranslations()
  const locale = useLocale()

  return (
    <RadioGroup
      defaultValue={locale}
      values={translate('all')('locale')}
      onValueChange={locale => {
        router.replace(router.pathname, t('routes.settings'), {
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
