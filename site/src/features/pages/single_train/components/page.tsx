import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { interpolateString as i } from '@junat/core/i18n'
import { DialogProvider } from '@junat/ui/components/dialog'
import {
  CheckboxItem,
  DropdownMenu,
  Item,
  itemIcon,
} from '@junat/ui/components/dropdown_menu/index'
import { ErrorMessageWithRetry } from '@junat/ui/components/error_message'
import { Spinner } from '@junat/ui/components/spinner'
import { useToast } from '@junat/ui/components/toast/index'
import Calendar from '@junat/ui/icons/calendar.svg'
import CirclesHorizontal from '@junat/ui/icons/circles_horizontal.svg'
import ObjectHorizontalLeft from '@junat/ui/icons/object_horizontal_left.svg'
import Share from '@junat/ui/icons/share.svg'

import { Head } from '~/components/head'
import { translate, useLocale, useTranslations } from '~/i18n'
import Page from '~/layouts/page'
import { getNewTrainPath, getTrainTitle, handleShare } from '../helpers'
import { useBestTrain } from '../hooks'
import { BlankState } from './blank_state'
import { RelativeDepartureDate } from './relative_departure_date'

const DatePickerDialog = dynamic(() =>
  import('./date_picker_dialog').then(mod => mod.DatePickerDialog),
)

const SingleTimetable = dynamic(() => import('~/components/single_timetable'))

export function TrainPage() {
  const router = useRouter()

  const departureDate = router.query.date as string

  const trainNumber = router.query.trainNumber
    ? Number(router.query.trainNumber)
    : undefined

  const { train, singleTrainQuery } = useBestTrain(departureDate, trainNumber)
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false)
  const [showTrack, setShowTrack] = React.useState(false)
  const toast = useToast(state => state.toast)

  const locale = useLocale()
  const t = useTranslations()

  const { trainType, trainTitle } = getTrainTitle(
    train
      ? { trainNumber: train?.trainNumber, trainType: train?.trainType }
      : undefined,
    t,
  )

  if (singleTrainQuery.isFetched && !train) {
    return <BlankState />
  }

  if (!(trainNumber && trainTitle && departureDate)) {
    return <Spinner variant="fixedToCenter" />
  }

  // If there is a train displayed to user and the query that caused an error is `singleTrainQuery`
  // don't show the error. Train and error can exist at the same time if using a cached train
  // and `singleTrainQuery` failed, or the error was caused by refetch (eg. stale data).
  const showError = singleTrainQuery.isError && !train

  const supportsShareApi =
    typeof window !== 'undefined' && 'share' in (window.navigator ?? {})

  const handleChoice = (newDepartureDate: string) => {
    const path = getNewTrainPath({
      newDepartureDate,
      oldDepartureDate: departureDate,
      path: router.asPath,
      trainNumber,
    })

    if (path) {
      router.push(path, undefined, { shallow: false, scroll: true })
    }
  }

  return (
    <>
      <Head
        title={trainTitle ?? ''}
        description={i(
          t('trainPage.meta.description { trainType } { trainNumber }'),
          {
            trainType,
            trainNumber,
          },
        )}
        path={router.asPath}
        locale={locale}
        replace={translate('all')('routes')}
      />
      <main>
        <div className="mb-1 flex items-center justify-between">
          <h1>{trainTitle ?? ''}</h1>

          <DropdownMenu
            //  Radix fails to cleanup `pointer-events: none` on body element
            modal={false}
            triggerIcon={<CirclesHorizontal />}
            triggerLabel="Change options"
          >
            <Item onClick={() => setDialogIsOpen(true)}>
              {t('chooseDate')}
              <Calendar className={itemIcon.className} />
            </Item>

            <CheckboxItem
              onClick={event => {
                // prevent menu from closing
                event.preventDefault()

                setShowTrack(!showTrack)
              }}
            >
              {showTrack ? t('hideTracks') : t('showTracks')}
              <ObjectHorizontalLeft className={itemIcon.className} />
            </CheckboxItem>

            {supportsShareApi && (
              <Item
                onClick={event => {
                  handleShare(event, {
                    title: trainTitle,
                    text: i(t('timetablesFor { train }'), {
                      train: `${trainType} ${trainNumber}`,
                    }),
                    url: location.href,
                  }).catch(() => toast(t('errors.shareError')))
                }}
              >
                {t('shareTrain')}
                <Share className={itemIcon.className} />
              </Item>
            )}
          </DropdownMenu>
        </div>

        <div className="mb-5 md:mb-8">
          <RelativeDepartureDate departureDate={departureDate} />
        </div>

        <DialogProvider open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
          <DatePickerDialog
            departureDate={departureDate}
            locale={locale}
            onOpenChange={setDialogIsOpen}
            handleChoice={handleChoice}
          />
        </DialogProvider>

        {showError && (
          <ErrorMessageWithRetry
            error={singleTrainQuery.error}
            onRetryButtonClicked={() => singleTrainQuery.refetch()}
          />
        )}

        {train && (
          <SingleTimetable
            showTrack={showTrack}
            timetableRows={train.timeTableRows}
          />
        )}
      </main>
    </>
  )
}

TrainPage.layout = Page
