import { useRouter } from 'next/router'

import dynamic from 'next/dynamic'

import React from 'react'

import translate from '@utils/translate'
import { getLocale } from '@utils/get_locale'

import { FINTRAFFIC } from '@constants'

import { StyledFooter } from './styles'
import { getFintrafficPath } from './helpers'
import { useStations } from '~/lib/digitraffic'

const LanguageSelect = dynamic(
  () => import('@components/input/language_select')
)

const Anchor = (
  props: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>
) => (
  <a {...props} target="_blank" rel="noreferrer">
    {props.children}
  </a>
)

export function AppFooter() {
  const router = useRouter()
  const { data: stations = [] } = useStations()
  const locale = getLocale(router.locale)

  const t = translate(locale)

  const path = getFintrafficPath(locale)

  return (
    <StyledFooter>
      <section>
        <LanguageSelect router={router} stations={stations} />
      </section>
      <section>
        <small>
          {`${t('trafficDataSource')} `}
          <Anchor href={`${FINTRAFFIC.URL}${path}`}>Fintraffic</Anchor>{' '}
          {`${t('license')} `}
          <Anchor href={`${FINTRAFFIC.LICENSE_URL}${locale}`}>
            {FINTRAFFIC.LICENSE}
          </Anchor>
        </small>
      </section>
    </StyledFooter>
  )
}
