import type { CSS } from '@stitches/react'
import type { Locale } from '@typings/common'

import { styled } from '@config/theme'

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
  translations: Record<Locale, string>
  css?: CSS
  as?: React.ComponentType<any> | string
}) {
  return (
    <StyledNoScript css={css} as={as} className="noscript-alert">
      {Object.keys(translations).map(key => {
        return (
          <p lang={key} key={key}>
            {translations[key as Locale]}
          </p>
        )
      })}
    </StyledNoScript>
  )
}

export default NoScript
