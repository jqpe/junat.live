import React from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { DialogProvider } from '~/components/dialog'
import { ErrorMessageWithRetry } from '~/components/error_message'
import { Head } from '~/components/head'
import { Header } from '~/components/header'
import { Spinner } from '~/components/spinner'

import Calendar from '~/components/icons/calendar.svg'
import Share from '~/components/icons/share.svg'

import { ROUTES } from '~/constants/locales'

import Page from '~/layouts/page'

import { getLocale } from '~/utils/get_locale'
import interpolateString from '~/utils/interpolate_string'
import translate from '~/utils/translate'

import { DropdownMenu, Item, itemIcon } from '~/features/dropdown_menu'
import { useToast } from '~/features/toast'

import { getNewTrainPath, getTrainTitle, handleShare } from '../helpers'
import { useBestTrain } from '../hooks'
import { BlankState } from './blank_state'

const DatePickerDialog = dynamic(() =>
  import('./date_picker_dialog').then(mod => mod.DatePickerDialog)
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
  const toast = useToast(state => state.toast)

  const locale = getLocale(router.locale)
  const t = translate(locale)

  const { trainType, trainTitle } = getTrainTitle(train, locale, t)

  if (singleTrainQuery.isFetched && !train) {
    return <BlankState />
  }

  if (!(trainNumber && trainTitle && departureDate)) {
    return <Spinner fixedToCenter />
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
      trainNumber
    })

    path && router.push(path, undefined, { shallow: false, scroll: true })
  }

  return (
    <>
      <Head
        title={trainTitle ?? ''}
        description={interpolateString(t('trainPage', 'meta', '$description'), {
          trainType,
          trainNumber
        })}
        path={router.asPath}
        locale={getLocale(router.locale)}
        replace={ROUTES}
      />
      <main>
        <Header heading={trainTitle ?? ''} />

        <div className="flex items-center justify-end mb-9">
          <DropdownMenu
            // FIXME: disable modal for now as Radix fails to
            // cleanup `pointer-events: none` on body element
            modal={false}
            triggerLabel="Change options"
          >
            <Item onClick={() => setDialogIsOpen(true)}>
              {t('chooseDate')}
              <Calendar className={itemIcon.className} />
            </Item>

            {supportsShareApi && (
              <Item
                onClick={event => {
                  handleShare(event, {
                    title: trainTitle,
                    text: interpolateString(t('$timetablesFor'), {
                      train: `${trainType} ${trainNumber}`
                    }),
                    url: location.href
                  }).catch(() => toast(t('errors', 'shareError')))
                }}
              >
                {t('shareTrain')}
                <Share className={itemIcon.className} />
              </Item>
            )}
          </DropdownMenu>
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
            locale={locale}
            onRetryButtonClicked={() => singleTrainQuery.refetch()}
          />
        )}

        {train && <SingleTimetable timetableRows={train.timeTableRows} />}
      </main>
    </>
  )
}

TrainPage.layout = Page
