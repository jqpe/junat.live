import type { TrainLongName } from '@junat/cms'
import type { GetServerSidePropsContext } from 'next'

import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'

import { getTrainLongNames, getTrainPage } from '@junat/cms'

import Webmanifest from '@components/common/Webmanifest'
import Header from '@components/common/Header'

import useLiveTrain from '@hooks/use_live_train'
import Page from '@layouts/Page'
import { getLocale } from '@utils/get_locale'
import { fetchStations } from '@services/digitraffic.service'

import constants from 'src/constants'

const SingleTimetable = dynamic(
  () => import('@junat/ui/components/SingleTimetable')
)
const DefaultError = dynamic(() => import('next/error'))

interface TrainPageProps {
  longNames: TrainLongName[]
  trainNumber: number
  departureDate: string
  cancelled: string
}

export default function TrainPage({
  longNames,
  trainNumber,
  departureDate,
  cancelled
}: TrainPageProps) {
  const [train, error] = useLiveTrain({
    trainNumber,
    departureDate
  })
  const router = useRouter()
  const locale = getLocale(router.locale)

  const { data: stations } = useQuery('stations', fetchStations)

  const longName = useMemo(() => {
    if (train) {
      return longNames.find(({ code }) => code === train.trainType)?.name
    }
  }, [longNames, train])

  return (
    <>
      <Head>
        <title>{longName && `${longName} ${trainNumber}`}</title>
      </Head>
      <Webmanifest
        startUrl={router.asPath.replace(/\d{4}-\d{2}-\d{2}/, 'latest')}
        name={`${longName} ${trainNumber} | ${constants.SITE_NAME}`}
        shortName={`${longName} ${trainNumber}`}
        shouldRender={longName !== undefined}
      />
      <main>
        <Header heading={longName && `${longName} ${trainNumber}`} />
        {train && stations && (
          <SingleTimetable
            cancelledText={cancelled}
            timetableRows={train.timeTableRows}
            locale={locale}
            stations={stations}
          />
        )}
        {error && <DefaultError statusCode={404} />}
      </main>
    </>
  )
}

TrainPage.layout = Page

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const locale = getLocale(context.locale)

  const longNames = await getTrainLongNames(locale)
  const { cancelled } = await getTrainPage(locale)

  const departureDate = context.query.date as unknown as string
  const trainNumber = context.query.trainNumber as unknown as string

  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=31536000, stale-while-revalidate'
  )

  return {
    props: {
      longNames,
      trainNumber,
      departureDate,
      cancelled
    }
  }
}
