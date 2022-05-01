import type { GetServerSidePropsContext } from 'next'
import type { Train } from '~digitraffic'

import { getSingleTrain } from '~digitraffic'

import { getLocaleOrThrow } from '@utils/get_locale_or_throw'
import { directus } from '@server/lib/cms/directus'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const json = await directus.getTrainLongNames(
    getLocaleOrThrow(context.locale)
  )
  const departureDate = context.query.date as unknown as string

  const train: Train = await getSingleTrain({
    date: departureDate,
    trainNumber: Number(context.query.trainNumber)
  }).then(trains => trains[0])

  const longName = json.data.find(longName => longName.code === train.trainType)

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
