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
  css?: CSS
  translations?: {
    fi?: string
    en?: string
    sv?: string
  }
  as?: React.ComponentType<any> | string
} = {}) {
  return (
    <StyledNoScript css={css} as={as} className="noscript-alert">
      <p lang="fi">
        {translations?.fi ?? 'Laita JavaScript päälle selaimesi asetuksista.'}
      </p>
      <p lang="en">
        {translations?.en ?? 'Enable JavaScript in your browser settings.'}
      </p>
      <p lang="sv">
        {translations?.sv ??
          'Aktivera JavaScript i din webbläsarinställningar.'}
      </p>
    </StyledNoScript>
  )
}
