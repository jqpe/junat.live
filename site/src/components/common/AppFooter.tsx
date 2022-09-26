/* eslint-disable sonarjs/no-duplicate-string */
import { useRouter } from 'next/router'

import { styled } from '@junat/design'

import translate from '@utils/translate'
import { getLocale } from '@utils/get_locale'

import dynamic from 'next/dynamic'

const linearGradient = (
  d: number,
  color: string,
  colorPos: string,
  color2: string,
  colorPos2: string
) => {
  return `linear-gradient(${d}deg, ${color} ${colorPos}, ${color2} ${colorPos2})`
}

const backgroundImage = [
  linearGradient(45, '$slateGray900', '25%', 'transparent', '20%'),
  linearGradient(-45, '$slateGray900', '25%', 'transparent', '25%'),
  linearGradient(45, 'transparent', '75%', '$secondary900', '75%'),
  linearGradient(-45, 'transparent', '75%', '$slateGray900', '75%'),
  linearGradient(-45, 'transparent', '', '$slateGray800', '25%'),
  linearGradient(-45, 'transparent', '', '$slateGray900', '15%')
].join(',')

const StyledFooter = styled('footer', {
  marginTop: '3rem',
  padding: '1rem 5vw',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  right: 0,
  left: 0,
  backgroundColor: '$slateGray700',
  color: '$slateGray500',
  fontSize: '$mobile-caption',
  '@large': {
    fontSize: '$pc-caption'
  },
  background: 'linear-gradient($slateGray900, $slateGray900)',
  backgroundImage,
  backgroundSize: '15px 5px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px, -10px 0, 10px 12px',
  '& a': {
    color: '$primary500',
    '&:hover,&:focus': {
      color: '$primary200'
    }
  }
})

const FINTRAFFIC = 'https://www.fintraffic.fi/' as const
const LICENSE = 'https://creativecommons.org/licenses/by/4.0/deed.' as const

const LanguageSelect = dynamic(() => import('@components/LanguageSelect'))

export default function AppFooter() {
  const router = useRouter()
  const locale = getLocale(router.locale)

  const t = translate(locale)

  const path = locale === 'fi' || locale === 'sv' ? locale : 'en'

  const anchorProps = {
    target: '_blank',
    rel: 'noreferrer'
  }

  return (
    <StyledFooter>
      <section>
        <LanguageSelect router={router} />
      </section>
      <section>
        <span>
          {t('trafficDataSource')}{' '}
          <a href={`${FINTRAFFIC}${path}`} {...anchorProps}>
            Fintraffic
          </a>{' '}
          {t('license')}{' '}
          <a href={`${LICENSE}${locale}`} {...anchorProps}>

            CC 4.0 BY
          </a>
        </span>
      </section>
    </StyledFooter>
  )
}
