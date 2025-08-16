import type { MouseEventHandler, ReactNode } from 'react'

import { cx } from 'cva'

import { DigitrafficError } from '@junat/digitraffic'
import { useUi } from '@junat/react-hooks/ui'
import { Button } from './button'

const Message = (props: { msg: ReactNode; showTrackStatusLink?: boolean }) => {
  const { t, Link } = useUi()

  return (
    <aside
      className={cx(
        'text-error-950 dark:text-error-50 rounded-sm bg-error-300 px-2 py-1',
        'dark:bg-transparent dark:[border:1px_solid_theme(colors.error.700)]',
      )}
    >
      {props.msg}
      {props.showTrackStatusLink ? (
        <>
          {t('trackStatus')}
          <Link href="https://status.digitraffic.fi" target="_blank">
            status.digitraffic.fi
          </Link>{' '}
        </>
      ) : null}
    </aside>
  )
}

export const ErrorMessage = ({ error }: { error: unknown }) => {
  const digitraffic = error instanceof DigitrafficError
  const networkError = digitraffic && error.isNetworkError
  const tooManyRequests = digitraffic && error.status === 429
  const digitrafficHttpError = digitraffic && error.status >= 400

  const { t, Link } = useUi()

  if (tooManyRequests) {
    return <Message msg={t('errors.digitraffic.tooManyRequests')} />
  }

  if (networkError) {
    return <Message msg={t('errors.digitraffic.networkError')} />
  }

  if (digitrafficHttpError) {
    return (
      <Message showTrackStatusLink msg={t('errors.digitraffic.unexpected')} />
    )
  }

  return Message({
    msg: (
      <>
        {t('errors.unknown')}
        <Link href="mailto:support@junat.live" target="_blank">
          support@junat.live
        </Link>
        {'.'}
      </>
    ),
  })
}

export const ErrorMessageWithRetry = (props: {
  error: unknown
  onRetryButtonClicked: MouseEventHandler<HTMLButtonElement>
}) => {
  const { t } = useUi()

  return (
    <div className="flex flex-col items-start gap-4">
      <ErrorMessage error={props.error} />
      <Button className="relative" onClick={props.onRetryButtonClicked}>
        {t('tryAgain')}
      </Button>
    </div>
  )
}
