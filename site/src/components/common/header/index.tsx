import { StyledHeader } from './styles'

export default function Header({ heading }: { heading: string }) {
  return (
    <StyledHeader>
      <h1>{heading}</h1>
    </StyledHeader>
  )
}
