import { styled } from '@junat/design'
import { useState } from 'react'

const Text = styled('button', {
  fontFamily: 'monospace',
  '&:hover': {
    cursor: 'copy'
  }
})

export function Copyable({ text }: { text: string }) {
  const [clicked, setClicked] = useState(false)

  return (
    <Text
      css={{
        color: clicked ? '$primary600' : '$primary500',
        transition: 'outline ease-in 50ms',
        '&:focus': {
          transition: 'outline ease-out 250ms',
          outline: clicked ? '0px solid transparent' : '1px solid $primary500'
        }
      }}
      onClick={() =>
        navigator.clipboard.writeText(text).then(
          () =>
            new Promise<void>(resolve => {
              setClicked(true)

              setTimeout(() => resolve(setClicked(false)), 500)
            })
        )
      }
    >
      {clicked ? 'Copied!' : text}
    </Text>
  )
}
