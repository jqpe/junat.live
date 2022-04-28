import type { TrainLongName } from '@typings/train_long_name'

import Head from 'next/head'

import { Train } from '~digitraffic'

import useLiveTrain from '@hooks/use_live_train.hook'

import constants from 'src/constants'
import Page from '@layouts/Page'
import SingleTimetable from '@components/SingleTimetable'

interface TrainPageProps {
  longName: TrainLongName
  train: Train
  departureDate: string
}

export default function TrainPage({
  longName,
  train: oldTrain,
  departureDate
}: TrainPageProps) {
  const train = useLiveTrain({
    trainNumber: oldTrain.trainNumber,
    departureDate,
    initialTrain: oldTrain
  })

  return (
    <>
      <Head>
        <title>
          {longName.name} {train.trainNumber} | {constants.SITE_NAME}
        </title>
      </Head>
      <main>
        <header>
          <h1>
            {longName.name} {train.trainNumber}
          </h1>
        </header>

        <SingleTimetable timetableRows={train.timeTableRows} />
      </main>
    </>
  )
}

TrainPage.layout = Page

export { getServerSideProps } from '@server/lib/pages/train'
