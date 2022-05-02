import type { TrainLongName } from '@typings/train_long_name'

import Head from 'next/head'

import useLiveTrain from '@hooks/use_live_train.hook'

import constants from 'src/constants'
import Page from '@layouts/Page'
import SingleTimetable from '@components/SingleTimetable'
import { useMemo } from 'react'

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
  const train = useLiveTrain({
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
      </main>
    </>
  )
}

TrainPage.layout = Page

export { getServerSideProps } from '@server/lib/pages/train'
