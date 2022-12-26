import type { TrainPageProps } from '@features/pages/single_train'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

export { TrainPage as default } from '@features/pages/single_train'

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<TrainPageProps> | undefined> {
  const departureDate = String(context.query.date)
  const trainNumber = Number(context.query.trainNumber)

  // If departureDate is not a parseable date or latest
  const unparseableDate: boolean = (() => {
    try {
      return Number.isNaN(Date.parse(departureDate))
    } catch {
      return true
    }
  })()

  if (unparseableDate && departureDate !== 'latest') {
    return { notFound: true }
  }

  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=31536000, stale-while-revalidate'
  )

  return {
    props: {
      trainNumber,
      departureDate
    }
  }
}
