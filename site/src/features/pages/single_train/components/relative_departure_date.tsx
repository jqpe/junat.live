import { useLocale } from '~/i18n'

type Props = {
  departureDate: string
}

export const RelativeDepartureDate = (props: Props) => {
  const locale = useLocale()

  const currentDate = new Date()
  const date = new Date(
    props.departureDate === 'latest'
      ? Date.now()
      : Date.parse(props.departureDate),
  )

  const diff = date.getDate() - currentDate.getDate()

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
      dateTime={date.toISOString()}
      className="rounded-full border-[1px] border-gray-300 px-2 py-0.5 font-ui text-sm leading-5 text-gray-700 dark:border-gray-800 dark:text-gray-500"
    >
      {capitalize(relative)}
    </time>
  )
}

const capitalize = (string: string) => {
  return string[0]!.toUpperCase() + string.slice(1)
}
