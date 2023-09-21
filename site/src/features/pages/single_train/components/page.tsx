import React from 'react'

import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import Header from '@components/common/header'
import { Head } from '@components/common/head'

import { useLiveTrainSubscription, useSingleTrain } from '~/lib/digitraffic'
import { useStations } from '@hooks/use_stations'

import Page from '@layouts/page'

import { getLocale } from '@utils/get_locale'

import translate from '@utils/translate'
import { Code, getTrainType } from '@utils/train'

import interpolateString from '@utils/interpolate_string'

import { ROUTES } from '~/constants/locales'
import { Spinner } from '~/components/elements/spinner'

const DefaultError = dynamic(() => import('next/error'))

const DatePicker = dynamic(() =>
  import('./date_picker').then(mod => mod.DatePicker)
)

const SingleTimetable = dynamic(
  () => import('@components/timetables/single_timetable')
)

export function TrainPage() {
  const router = useRouter()
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false)
  const [userDate, setUserDate] = React.useState<string>()

  const departureDate =
    userDate || (router.query.date ? String(router.query.date) : undefined)

  const trainNumber = router.query.trainNumber
    ? Number(router.query.trainNumber)
    : undefined

  const { data: initialTrain, isFetched } = useSingleTrain({
    trainNumber,
    departureDate
  })

  const [subscriptionTrain, error] = useLiveTrainSubscription({
    initialTrain,
    enabled: initialTrain !== undefined
  })

  const train = subscriptionTrain || initialTrain

  const locale = getLocale(router.locale)

  const t = translate(locale)

  const { data: stations } = useStations()

  const trainType = React.useMemo(() => {
    if (train) {
      return getTrainType(train.trainType as Code, locale)
    }
  }, [locale, train])

  if (!(trainNumber && trainType && departureDate)) {
    return (
      <Spinner
        css={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          background: '$secondary500'
        }}
      />
    )
  }

  if (!/(latest|\d{4}-\d{2}-\d{2})/.test(departureDate)) {
    throw new TypeError('Date is not valid.')
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
        <>
          <Header heading={`${trainType} ${trainNumber}`} />

          <DatePicker
            departureDate={departureDate}
            open={dialogIsOpen}
            locale={locale}
            onOpenChange={setDialogIsOpen}
            handleChoice={setUserDate}
          />

          {train && stations && (
            <SingleTimetable
              cancelledText={t('cancelled')}
              timetableRows={train.timeTableRows}
              locale={locale}
              stations={stations}
            />
          )}
          {(error || (!initialTrain && isFetched)) && (
            <DefaultError statusCode={404} />
          )}
        </>
      </main>
    </>
  )
}

TrainPage.layout = Page
