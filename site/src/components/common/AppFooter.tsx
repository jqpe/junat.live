/* eslint-disable sonarjs/no-duplicate-string */
import { useRouter } from 'next/router'

import { styled } from '@config/theme'

import translate from '@utils/translation'
import { getLocale } from '@utils/get_locale'

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

export default function AppFooter() {
  const router = useRouter()
  const locale = getLocale(router.locale)

  const t = translate(locale)

  const path = locale === 'fi' || locale === 'sv' ? locale : 'en'

  return (
    <StyledFooter>
      <section>
        <span>
          {t('trafficDataSource')}{' '}
          <a
            href={`https://www.fintraffic.fi/${path}`}
            target="_blank"
            rel="noreferrer"
          >
            Fintraffic
          </a>{' '}
          {t('license')}{' '}
          <a
            href={`https://creativecommons.org/licenses/by/4.0/deed.${locale}`}
            target="_blank"
            rel="noreferrer"
          >
            CC 4.0 BY
          </a>
        </span>
      </section>
    </StyledFooter>
  )
}
