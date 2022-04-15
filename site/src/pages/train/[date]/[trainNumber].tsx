import type { TrainLongName } from '@typings/train_long_name'
import type { GetServerSidePropsContext } from 'next'

import Head from 'next/head'

import { getSingleTrain, Train } from '~digitraffic'

import SingleTimetableRow from '@components/SingleTimetableRow'
import useLiveTrain from '@hooks/use_live_train.hook'
import useTrainLocations from '@hooks/use_train_locations.hook'

import constants from 'src/constants'
import Page from '@layouts/Page'

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

  const locations = useTrainLocations({
    departureDate,
    trainNumber: oldTrain.trainNumber
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

        <table>
          <tbody>
            {train.timeTableRows
              .filter(tr => tr.type === 'DEPARTURE')
              .map(timetableRow => (
                <SingleTimetableRow
                  key={
                    timetableRow.liveEstimateTime || timetableRow.scheduledTime
                  }
                  timetableRow={timetableRow}
                />
              ))}
          </tbody>
        </table>
      </main>
    </>
  )
}

TrainPage.layout = Page

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const json: TrainLongName[] = await fetch(
    `https://cms.junat.live/items/train_long_name?filter[language][_eq]=${context.locale}`
  )
    .then(response => response.json())
    .then(json => json.data)

  const departureDate = context.query.date as unknown as string

  const train: Train = await getSingleTrain({
    date: departureDate,
    trainNumber: Number(context.query.trainNumber)
  }).then(trains => trains[0])

  const longName = json.find(longName => longName.code === train.trainType)

  if (!longName) {
    return { notFound: true }
  }

  return {
    props: {
      longName,
      train,
      departureDate
    }
  }
}
