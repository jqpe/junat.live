import type { Locale } from '~/types/common'

import { translate } from '~/utils/translate'

/**
 * @returns Truncated accuracy with an unit, one of meters or kilometers. Special case 'sv' where 1 metre is just en metre same for kilometre.
 */
export const getPrettifiedAccuracy = (
  accuracy: number,
  locale: Locale,
): string => {
  const t = translate(locale)
  let [meters, kilometers] = [
    `${Math.trunc(accuracy)} ${t('metres')}`,
    `${Math.trunc(accuracy / 1000)} ${t('kilometres')}`,
  ]

  if (Math.trunc(accuracy) === 1) {
    meters =
      locale === 'sv' ? t('metre') : `${Math.trunc(accuracy)} ${t('metre')}`
  }
  if (Math.trunc(accuracy / 1000) === 1) {
    kilometers =
      locale === 'sv'
        ? t('kilometre')
        : `${Math.trunc(accuracy / 1000)} ${t('kilometre')}`
  }

  return accuracy < 1000 ? meters : kilometers
}
