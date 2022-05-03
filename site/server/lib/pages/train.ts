import type { GetServerSidePropsContext } from 'next'

import { getLocaleOrThrow } from '@utils/get_locale_or_throw'
import { directus } from '@server/lib/cms/directus'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const json = await directus.getTrainLongNames(
    getLocaleOrThrow(context.locale)
  )
  const departureDate = context.query.date as unknown as string
  const trainNumber = context.query.trainNumber as unknown as string

  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=31536000, stale-while-revalidate'
  )

  return {
    props: {
      longNames: json.data,
      trainNumber,
      departureDate
    }
  }
}
