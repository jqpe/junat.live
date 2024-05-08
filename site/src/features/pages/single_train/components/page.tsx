import React from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { Head } from '~/components/head'
import { Header } from '~/components/header'

import {
  useSingleTrain,
  useSingleTrainSubscription,
  useStations
} from '~/lib/digitraffic'
import { getErrorQuery } from '~/lib/react_query'

import Page from '~/layouts/page'

import { getLocale } from '~/utils/get_locale'

import { Code, getTrainType } from '~/utils/train'
import translate from '~/utils/translate'

import interpolateString from '~/utils/interpolate_string'

import { DialogProvider } from '~/components/dialog'
import { ErrorMessageWithRetry } from '~/components/error_message'
import { Spinner } from '~/components/spinner'
import { ROUTES } from '~/constants/locales'

import { DropdownMenu, Item, itemIcon } from '~/features/dropdown_menu'

import { getDepartureDate } from '../helpers'

import Calendar from '~/components/icons/calendar.svg'

import { BlankState } from './blank_state'

const DatePickerDialog = dynamic(() =>
  import('./date_picker_dialog').then(mod => mod.DatePickerDialog)
)

const SingleTimetable = dynamic(() => import('~/components/single_timetable'))

export function TrainPage() {
  const router = useRouter()
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false)
  const [userDate, setUserDate] = React.useState<string>()

  const locale = getLocale(router.locale)
  const t = translate(locale)

  const departureDate = getDepartureDate({
    userProvided: userDate,
    default: router.query.date
  })

  const trainNumber = router.query.trainNumber
    ? Number(router.query.trainNumber)
    : undefined

  const singleTrainQuery = useSingleTrain({
    trainNumber,
    departureDate
  })
  const initialTrain = singleTrainQuery.data

  const [subscriptionTrain] = useSingleTrainSubscription({
    initialTrain: initialTrain === null ? undefined : initialTrain,
    enabled: initialTrain !== undefined && initialTrain !== null
  })

  const train = subscriptionTrain || initialTrain

  const { data: stations, ...stationsQuery } = useStations()

  const trainType = train && getTrainType(train?.trainType as Code, locale)

  if (singleTrainQuery.isFetched && !train) {
    return <BlankState />
  }

  if (!(trainNumber && trainType && departureDate)) {
    return <Spinner fixedToCenter />
  }

  const errorQuery = getErrorQuery([stationsQuery, singleTrainQuery])

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
            handleChoice={setUserDate}
          />
        </DialogProvider>

        {errorQuery !== undefined && (
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
