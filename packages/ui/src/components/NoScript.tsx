import type { CSS } from '@stitches/react'
import { styled } from '@junat/stitches'

const StyledNoScript = styled('noscript', {
  background: '$slateGray900',
  color: '$slateGray100',
  '@dark': {
    background: '$slateGray100',
    color: '$slateGray900'
  },
  padding: '$2',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
})

export function NoScript({
  css,
  as,
  translations
}: {
  translations: {
    fi: string
    en: string
    sv: string
  }
  css?: CSS
  as?: React.ComponentType<any> | string
}) {
  return (
    <StyledNoScript css={css} as={as} className="noscript-alert">
      {Object.keys(translations).map(key => {
        return (
          <p lang={key} key={key}>
            {translations[key as 'fi' | 'en' | 'sv']}
          </p>
        )
      })}
    </StyledNoScript>
  )
}

export default NoScript
