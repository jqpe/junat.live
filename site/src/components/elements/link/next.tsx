import type { LinkProps } from '.'

import { default as NLink, LinkProps as NLinkProps } from 'next/link'

import { StyledLink } from './styles'

type NextLinkProps = NLinkProps & LinkProps

export const NextLink = (props: NextLinkProps) => {
  return <StyledLink {...props} as={NLink} />
}
