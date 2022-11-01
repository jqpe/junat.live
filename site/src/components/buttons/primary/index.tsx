import { StyledPrimaryButton } from './styles'

export const PrimaryButton = (
  props: Parameters<typeof StyledPrimaryButton>[0]
) => {
  return <StyledPrimaryButton {...props} />
}
