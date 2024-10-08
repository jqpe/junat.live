import { cx } from 'cva'
import { differenceInCalendarDays } from 'date-fns'

import { useI18nStore } from '~/i18n'

type Props = {
  departureDate: string
}

export const RelativeDepartureDate = (props: Props) => {
  const locale = useI18nStore(state => state.locale)

  const currentDate = new Date()
  const date = new Date(
    props.departureDate === 'latest'
      ? Date.now()
      : Date.parse(props.departureDate),
  )

  const diff = differenceInCalendarDays(date, currentDate)

  const intl = new Intl.RelativeTimeFormat(locale, {
    style: 'long',
    numeric: 'auto',
  })

  const relative = intl.format(diff, 'day')

  if (diff === 0) {
    return <div />
  }

  return (
    <time
      data-testid={RelativeDepartureDate.testId}
      dateTime={date.toISOString()}
      className={cx(
        'rounded-full border-[1px] border-gray-300 px-2 py-0.5',
        'font-ui text-sm leading-5 text-gray-700 dark:border-gray-800 dark:text-gray-500',
      )}
    >
      {capitalize(relative)}
    </time>
  )
}

RelativeDepartureDate.testId = 'relative-departure-date'

const capitalize = (string: string) => {
  return string[0]!.toUpperCase() + string.slice(1)
}
