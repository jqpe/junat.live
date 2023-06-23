import { StyledLink } from './styles'

export const Link = (props: Parameters<typeof StyledLink>[0]) => {
  return <StyledLink {...props} />
}
