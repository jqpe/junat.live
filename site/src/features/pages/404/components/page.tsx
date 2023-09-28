import { PrimaryButton } from '~/components/buttons/primary'

import trees from '../assets/trees.jpg'

import { StyledImage } from '../styles'

import { StyledContent, StyledDiv } from '../styles'

export function NotFound() {
  return (
    <StyledDiv>
      <StyledImage placeholder="blur" fill src={trees} alt="" />

      <StyledContent>
        <h1>404</h1>
        <span role="presentation">|</span>
        <p>The page you were looking for could not be found.</p>
      </StyledContent>

      <PrimaryButton
        as="a"
        // @ts-expect-error `href` is not an attribute of <button>, but the element will render as <a>
        href="/"
        css={{
          textDecoration: 'none',
          '&:hover,&:focus': { color: '$slateGray200' }
        }}
      >
        Back to junat.live
      </PrimaryButton>
    </StyledDiv>
  )
}
