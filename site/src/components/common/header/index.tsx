import { StyledHeader } from './styles'

export function Header({ heading }: { heading: string }) {
  return (
    <StyledHeader>
      <h1>{heading}</h1>
    </StyledHeader>
  )
}
