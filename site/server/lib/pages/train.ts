import type { TrainLongName } from '@typings/train_long_name'
import type { GetServerSidePropsContext } from 'next'
import type { Train } from '~digitraffic'

import { getSingleTrain } from '~digitraffic'

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
