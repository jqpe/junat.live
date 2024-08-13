import NotFound from '~/assets/not_found.svg?react'
import { useTranslations } from '~/i18n'

export const BlankState = () => {
  const t = useTranslations()

  return (
    <div className="my-1/2 flex flex-col items-center gap-3">
      <NotFound className="[&>:nth-child(1)]:fill-primary-700 [&>:nth-child(2)]:fill-gray-500" />
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-lg">{t('notFound')}</h2>
        <p className="text-gray-700 dark:text-gray-300">
          {t('noTimetablesForTrain')}
        </p>
      </div>
    </div>
  )
}
