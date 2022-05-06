import type { TrainLongName } from '@typings/train_long_name'

import Head from 'next/head'
import DefaultError from 'next/error'

import { useMemo } from 'react'

import constants from 'src/constants'
import Page from '@layouts/Page'
import SingleTimetable from '@components/SingleTimetable'
import useLiveTrain from '@hooks/use_live_train.hook'

interface TrainPageProps {
  longNames: TrainLongName[]
  trainNumber: number
  departureDate: string
}

export default function TrainPage({
  longNames,
  trainNumber,
  departureDate
}: TrainPageProps) {
  const [train, error] = useLiveTrain({
    trainNumber,
    departureDate
  })

  const longName = useMemo(() => {
    if (train) {
      return longNames.find(longName => longName.code === train.trainType)?.name
    }
  }, [longNames, train])

  return (
    <>
      <Head>
        <title>
          {longName && `${longName} ${trainNumber} | ${constants.SITE_NAME}`}
        </title>
      </Head>
      <main>
        <header>
          <h1>{longName && `${longName} ${trainNumber}`}</h1>
        </header>

        {train && <SingleTimetable timetableRows={train.timeTableRows} />}
        {error && <DefaultError statusCode={404} />}
      </main>
    </>
  )
}

TrainPage.layout = Page

export { getServerSideProps } from '@server/lib/pages/train'
