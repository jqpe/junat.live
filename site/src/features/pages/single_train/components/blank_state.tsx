import { useRouter } from 'next/router'

import NotFound from '~/assets/not_found.svg'

import { translate } from '@junat/locales'
import { getLocale } from '~/utils/get_locale'

export const BlankState = () => {
  const router = useRouter()
  const t = translate(getLocale(router.locale))

  return (
    <div className="flex flex-col items-center gap-3 my-1/2">
      <NotFound className="[&>:nth-child(1)]:fill-primary-700 [&>:nth-child(2)]:fill-gray-500" />
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-lg">{t('notFound')}</h2>
        <p className="dark:text-gray-300 text-gray-700">
          {t('noTimetablesForTrain')}
        </p>
      </div>
    </div>
  )
}
