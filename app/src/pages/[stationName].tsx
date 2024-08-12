// import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
// import type { StationProps } from '~/features/pages/station'

// import { getStationPath } from '~/lib/digitraffic'
// import { getStations } from '~/lib/digitraffic/server'

// export { Station as default } from '~/features/pages/station'

// export const getStaticPaths = async () => {
//   const stations = await getStations({
//     betterNames: true,
//     keepInactive: true,
//     keepNonPassenger: true,
//   })

//   const paths = stations.map(station => ({
//     params: {
//       stationName: getStationPath(station.stationName.en),
//     },
//   }))

//   return {
//     paths,
//     fallback: false,
//   }
// }

// export const getStaticProps = async (
//   context: GetStaticPropsContext,
// ): Promise<GetStaticPropsResult<StationProps>> => {
//   const params = context.params

//   if (
//     !params ||
//     !(params.stationName && typeof params.stationName === 'string')
//   ) {
//     return { notFound: true }
//   }
//   const stations = await getStations({
//     betterNames: true,
//     keepInactive: true,
//     keepNonPassenger: true,
//   })

//   const station = stations.find(
//     s => getStationPath(s.stationName.en) === params.stationName,
//   )

//   if (!station) {
//     return { notFound: true }
//   }

//   return { props: { station } }
// }
