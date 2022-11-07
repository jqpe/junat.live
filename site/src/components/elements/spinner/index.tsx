import { StyledSpinner } from './styles'

type CSS = Parameters<typeof StyledSpinner>[0]['css']

export const Spinner = (props?: { css?: CSS }) => (
  <StyledSpinner css={props?.css} />
)
