import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import { RadioGroup } from '~/components/radio_group'
import { getLocale } from '~/utils/get_locale'
import translate from '~/utils/translate'

export const LanguageToggle = () => {
  const router = useRouter()

  return (
    <RadioGroup
      defaultValue={getLocale(router.locale)}
      values={translate('all')('locale')}
      onValueChange={locale => {
        router.replace(router.pathname, router.asPath, { locale })

        Cookies.set('NEXT_LOCALE', locale, {
          sameSite: 'Lax',
          secure: true,
          expires: 365
        })
      }}
    />
  )
}
