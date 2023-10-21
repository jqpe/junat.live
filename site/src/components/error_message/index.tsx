import type { MouseEventHandler, ReactNode } from 'react'
import type { Locale } from '~/types/common'

import { DigitrafficError } from '@junat/digitraffic'
import Link from 'next/link'

import { useDigitrafficApiStatus } from '~/lib/digitraffic'
import interpolateString from '~/utils/interpolate_string'
import translate from '~/utils/translate'
import { PrimaryButton } from '~/components/primary_button'

type Status =
  | 'operational'
  | 'under_maintenance'
  | 'partial_outage'
  | 'major_outage'

const Message = ({
  msg,
  children,
  locale
}: {
  msg: string | ReactNode
  children?: ReactNode[]
  locale?: Locale
}) => {
  return (
    <div className="bg-error-300 text-error-950 px-2 py-1 rounded-sm dark:bg-transparent dark:[border:1px_solid_theme(colors.error.700)] dark:text-error-50">
      {msg}
      {Number(children?.length) > 0 && (
        <ol className="[counter-reset:digitraffic-status] pl-2 py-1 flex flex-col gap-2">
          {children}
        </ol>
      )}
      {Number(children?.length) > 0 && locale && (
        <>
          {translate(locale)('trackStatus')}
          <Link href="https://status.digitraffic.fi" target="_blank">
            status.digitraffic.fi
          </Link>
        </>
      )}
    </div>
  )
}
const Status = <
  T extends {
    status: Status
    name: string
  }
>(
  component: T,
  locale: Locale
) => {
  if (component.status === 'operational') {
    return null
  }
  const t = translate(locale)
  const i = interpolateString

  const msg = {
    major_outage: i(t('errors', 'digitraffic', '$componentMajor'), {
      component: component.name
    }),
    partial_outage: i(t('errors', 'digitraffic', '$componentPartial'), {
      component: component.name
    }),
    under_maintenance: i(t('errors', 'digitraffic', '$componentScheduled'), {
      component: component.name
    })
  }[component.status]

  return (
    <li className="before:[content:counter(digitraffic-status)_'_'] before:text-error-500 before:font-bold before:text-xl [counter-increment:digitraffic-status]">
      {msg}
    </li>
  )
}

type ErrorMessageProps = {
  error: unknown
  locale: Locale
}

export const ErrorMessage = ({ error, locale }: ErrorMessageProps) => {
  const digitraffic = error instanceof DigitrafficError
  const networkError = digitraffic && error.isNetworkError
  const tooManyRequests = digitraffic && error.status === 429
  const digitrafficHttpError = digitraffic && error.status >= 400

  const t = translate(locale)

  const status = useDigitrafficApiStatus({
    queryKey: error,
    enabled: digitrafficHttpError
  })

  if (tooManyRequests) {
    return <Message msg={t('errors', 'digitraffic', 'tooManyRequests')} />
  }

  if (networkError) {
    return <Message msg={t('errors', 'digitraffic', 'networkError')} />
  }

  if (digitrafficHttpError) {
    const components =
      status.data?.components && Object.values(status.data.components)

    return Message({
      msg: t('errors', 'digitraffic', 'unexpected'),
      locale,
      children: components
        ? components.map(component => Status(component, locale))
        : undefined
    })
  }

  return Message({
    msg: (
      <>
        {t('errors', 'unknown')}
        <Link href="mailto:support@junat.live" target="_blank">
          support@junat.live
        </Link>
        {'.'}
      </>
    )
  })
}

export const ErrorMessageWithRetry = <
  T extends MouseEventHandler<HTMLButtonElement>
>(props: {
  error: unknown
  locale: Locale
  onRetryButtonClicked: T
}) => {
  return (
    <div className="flex flex-col gap-4 items-start">
      <ErrorMessage error={props.error} locale={props.locale} />
      <PrimaryButton
        onClick={props.onRetryButtonClicked}
        style={{ position: 'relative' }}
      >
        {translate(props.locale)('tryAgain')}
      </PrimaryButton>
    </div>
  )
}
