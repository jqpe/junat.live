import type { StationPassengerInfoFragment } from '@junat/graphql'

import React from 'react'
import { cx } from 'cva'
import { isSameDay } from 'date-fns'

import { BottomSheet } from '~/components/bottom_sheet'
import { Button } from '~/components/button'
import { useLocale, useTranslations } from '~/i18n'
import { useStationPassengerInfo } from '~/lib/digitraffic/hooks/use_station_passenger_info'
import { shouldDisplayPassengerInfoMessage } from '../helpers'

export const PassengerInformation = (props: { stationShortCode: string }) => {
  const infoQuery = useStationPassengerInfo(props)
  const locale = useLocale()
  const supportedLocale = ['fi', 'en', 'sv'].includes(locale) ? locale : 'en'
  const [isOpen, setIsOpen] = React.useState(false)

  const shownMessages = infoQuery.data?.filter(message => {
    return (
      message && shouldDisplayPassengerInfoMessage(message, supportedLocale)
    )
  })

  const t = useTranslations()

  if (infoQuery.isLoading || shownMessages?.length === 0) {
    return null
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="notification-badge">
        {t('exceptions')}{' '}
        <span className="tracking-widest">({shownMessages?.length})</span>
      </Button>
      <BottomSheet
        open={isOpen}
        header={t('exceptions')}
        snapPoints={({ minHeight }) => minHeight}
        onDismiss={() => setIsOpen(false)}
      >
        <div
          className={cx(
            'm-auto flex max-w-[550px] flex-col gap-2 px-4 py-2 pb-10',
          )}
        >
          {shownMessages?.map(message => (
            <Message key={message?.id} message={message} />
          ))}
        </div>
      </BottomSheet>
    </>
  )
}

const Message = (props: { message?: StationPassengerInfoFragment | null }) => {
  const locale = useLocale()
  const supportedLocale = ['fi', 'en', 'sv'].includes(locale) ? locale : 'en'

  if (!props.message?.video?.text[supportedLocale]) {
    return null
  }

  const start = props.message.video.deliveryRules.startDateTime
  const end = props.message.video.deliveryRules.endDateTime

  const intl = new Intl.DateTimeFormat(locale)

  return (
    <article className="flex flex-col gap-0.5">
      {start && end && (
        <div className="text-sm text-gray-700">
          {isSameDay(start, end) ? (
            <time dateTime={start}>{intl.format(Date.parse(start))}</time>
          ) : (
            <>
              <time dateTime={start}>{intl.format(Date.parse(start))}</time>
              {' — '}
              <time dateTime={end}>{intl.format(Date.parse(end))}</time>
            </>
          )}
        </div>
      )}
      <p>{props.message.video.text[supportedLocale]}</p>
    </article>
  )
}

export default PassengerInformation
