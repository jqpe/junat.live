import { useRouter } from 'next/router'

import dynamic from 'next/dynamic'

import React from 'react'

import translate from '@utils/translate'
import { getLocale } from '@utils/get_locale'

import { FINTRAFFIC } from '@constants'

import {
  StyledFooter,
  StyledSelectorsContainer,
  StyledThemeIcon
} from './styles'

import { getFintrafficPath } from './helpers'
import { Select } from '~/components/input/select'
import { usePreferences } from '~/hooks/use_preferences'

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

export default function AppFooter() {
  const router = useRouter()
  const locale = getLocale(router.locale)

  const t = translate(locale)

  const path = getFintrafficPath(locale)
  const { theme, setPreferences } = usePreferences()

  return (
    <StyledFooter>
      <StyledSelectorsContainer>
        <LanguageSelect router={router} />
        <Select
          Icon={<StyledThemeIcon />}
          items={translate(getLocale(router.locale))('theme')}
          label="theme"
          defaultValue={theme}
          onValueChange={value => {
            if (value === 'light' || value === 'dark' || value === 'auto') {
              setPreferences({ theme: value })
            }
          }}
        />
      </StyledSelectorsContainer>
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
