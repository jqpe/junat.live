import { Button } from '@chakra-ui/react'

interface FetchTrainsButtonProps {
  disabled: boolean
  isLoading: boolean
  handleClick: VoidFunction
  text: string
  visible: boolean
}

export default function FetchTrainsButton({
  disabled,
  handleClick,
  text,
  isLoading,
  visible
}: FetchTrainsButtonProps) {
  if (!visible) {
    return null
  }

  return (
    <Button
      disabled={disabled}
      onClick={handleClick}
      isLoading={isLoading}
      width="full"
      maxWidth={'500px'}
    >
      {text}
    </Button>
  )
}
