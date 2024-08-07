import type { GetStaticPropsResult } from 'next'
import type { HomeProps } from '~/features/pages/home'

import { getStations } from '~/lib/digitraffic/server'

export { Home as default } from '~/features/pages/home'

export const getStaticProps = async (): Promise<
  GetStaticPropsResult<HomeProps>
> => {
  const stations = getStations({ betterNames: true })

  return { props: { initialStations: await stations } }
}
