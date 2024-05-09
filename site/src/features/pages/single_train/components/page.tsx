import React from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { DialogProvider } from '~/components/dialog'
import { ErrorMessageWithRetry } from '~/components/error_message'
import { Head } from '~/components/head'
import { Header } from '~/components/header'
import { Spinner } from '~/components/spinner'

import Calendar from '~/components/icons/calendar.svg'

import { ROUTES } from '~/constants/locales'

import {
  useCachedTrain,
  useSingleTrain,
  useSingleTrainSubscription,
  useStations
} from '~/lib/digitraffic'
import { getErrorQuery } from '~/lib/react_query'

import Page from '~/layouts/page'

import { getLocale } from '~/utils/get_locale'
import interpolateString from '~/utils/interpolate_string'
import { Code, getTrainType } from '~/utils/train'
import translate from '~/utils/translate'

import { DropdownMenu, Item, itemIcon } from '~/features/dropdown_menu'

import { getCalendarDate } from '~/utils/date'
import { BlankState } from './blank_state'

const DatePickerDialog = dynamic(() =>
  import('./date_picker_dialog').then(mod => mod.DatePickerDialog)
)

const SingleTimetable = dynamic(() => import('~/components/single_timetable'))

export function TrainPage() {
  const router = useRouter()
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false)

  const locale = getLocale(router.locale)
  const t = translate(locale)

  const departureDate = router.query.date as string

  const trainNumber = router.query.trainNumber
    ? Number(router.query.trainNumber)
    : undefined

  // Attempts to use a stale train from `useLiveTrains` cache to render the page
  // without waiting for a network request for users navigating from station page.
  const cachedTrain = useCachedTrain({
    departureDate,
    trainNumber: trainNumber as number
  })

  const singleTrainQuery = useSingleTrain({
    trainNumber,
    departureDate
  })
  const initialTrain = singleTrainQuery.data

  const [subscriptionTrain] = useSingleTrainSubscription({
    initialTrain: initialTrain === null ? undefined : initialTrain,
    enabled: initialTrain !== undefined && initialTrain !== null
  })

  const train = subscriptionTrain || initialTrain || cachedTrain

  const stationsQuery = useStations()
  const stations = stationsQuery.data || []

  const trainType = train && getTrainType(train?.trainType as Code, locale)

  if (singleTrainQuery.isFetched && !train) {
    return <BlankState />
  }

  if (!(trainNumber && trainType && departureDate)) {
    return <Spinner fixedToCenter />
  }

  const errorQuery = getErrorQuery([stationsQuery, singleTrainQuery])

  // If there is a train displayed to user and the query that caused an error is `singleTrainQuery`
  // don't show the error. Train and error can exist at the same time if using a cached train
  // and `singleTrainQuery` failed, or the error was caused by refetch (eg. stale data).
  const hideError = errorQuery === singleTrainQuery && train

  const handleChoice = (choice: string) => {
    const today = getCalendarDate(new Date().toISOString())
    const currentDate = departureDate === 'latest' ? today : departureDate

    // Selected current date — do nothing
    if (choice === currentDate) {
      return
    }

    // Get the localized train part /<localizedTrain>/<departureDate?>/<trainNumber>
    const segment = router.asPath.split('/')[1]
    // Restore default /<localizedTrain>/<trainNumber> if departureDate is today
    if (choice === today) {
      choice = ''
    }
    const path = '/' + [segment, choice, trainNumber].filter(Boolean).join('/')

    router.push(path, undefined, {
      scroll: true,
      shallow: false
    })
  }

  return (
    <>
      <Head
        title={trainType ? `${trainType} ${trainNumber}` : ''}
        description={interpolateString(t('trainPage', 'meta', '$description'), {
          trainType,
          trainNumber
        })}
        path={router.asPath}
        locale={getLocale(router.locale)}
        replace={ROUTES}
      />
      <main>
        <Header heading={`${trainType} ${trainNumber}`} />

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

        {errorQuery !== undefined && !hideError && (
          <ErrorMessageWithRetry
            error={errorQuery.error}
            locale={locale}
            onRetryButtonClicked={() => errorQuery.refetch()}
          />
        )}

        {train && stations && (
          <SingleTimetable
            cancelledText={t('cancelled')}
            timetableRows={train.timeTableRows}
            locale={locale}
            stations={stations}
          />
        )}
      </main>
    </>
  )
}

TrainPage.layout = Page
