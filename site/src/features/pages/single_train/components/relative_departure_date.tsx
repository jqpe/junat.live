import { useRouter } from 'next/router'
import { getLocale } from '~/utils/get_locale'

type Props = {
  departureDate: string
}

export const RelativeDepartureDate = (props: Props) => {
  const router = useRouter()
  const locale = getLocale(router.locale)

  const currentDate = new Date()
  const date = new Date(
    props.departureDate === 'latest'
      ? Date.now()
      : Date.parse(props.departureDate)
  )

  const diff = date.getDate() - currentDate.getDate()

  const intl = new Intl.RelativeTimeFormat(locale, {
    style: 'long',
    numeric: 'auto'
  })
  const relative = intl.format(diff, 'day')

  if (diff === 0) {
    return <div />
  }

  return (
    <time
      dateTime={date.toISOString()}
      className="rounded-full border-[1px] py-0.5 leading-5 px-2 border-gray-300 text-gray-700
    dark:border-gray-800 dark:text-gray-500 text-sm font-ui"
    >
      {capitalize(relative)}
    </time>
  )
}

const capitalize = (string: string) => {
  return string[0]!.toUpperCase() + string.slice(1)
}
