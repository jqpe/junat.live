import type { CSS } from '@stitches/react'
import type { Locale } from '@typings/common'

import { StyledNoScript } from './styles'

export function NoScript({
  css,
  as,
  translations
}: {
  translations: Record<Locale, string>
  css?: CSS
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
