import { useRouter } from 'next/router'

import { Head } from '~/components/head'
import { Map } from '~/components/map/map'
import { useTranslations } from '~/i18n'
import FullWidthPage from '~/layouts/full_width_page'

export default function MapPage() {
  const router = useRouter()
  const t = useTranslations()

  return (
    <>
      <Head
        path={router.asPath}
        title={t('mapPage.meta.title')}
        description={t('mapPage.meta.description')}
      />

      <Map />
    </>
  )
}

MapPage.layout = FullWidthPage
