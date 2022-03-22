import SingleTimetableRow from '@components/SingleTimetableRow'
import type { TrainLongName } from '@typings/train_long_name'
import { GetServerSidePropsContext } from 'next'

import { getSingleTrain, Train } from '~digitraffic'

interface TrainPageProps {
  longName: TrainLongName
  train: Train
}

export default function TrainPage({ longName, train }: TrainPageProps) {
  return (
    <main>
      {longName && (
        <h1>
          {longName?.name} {train?.trainNumber}
        </h1>
      )}

      <table>
        <tbody>
          {train?.timeTableRows
            .filter(tr => tr.type === 'DEPARTURE')
            .map(timetableRow => (
              <SingleTimetableRow
                key={timetableRow.scheduledTime}
                timetableRow={timetableRow}
              />
            ))}
        </tbody>
      </table>
    </main>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log(context)

  const json: TrainLongName[] = await fetch(
    `https://cms.junat.live/items/train_long_name?filter[language][_eq]=${context.locale}`
  )
    .then(response => response.json())
    .then(json => json.data)

  const train: Train = await getSingleTrain({
    date: context.query.date as unknown as string,
    trainNumber: Number(context.query.trainNumber)
  }).then(trains => trains[0])

  const longName = json.find(longName => longName.code === train.trainType)

  if (!longName) {
    return { notFound: true }
  }

  return {
    props: {
      longName,
      train
    }
  }
}
