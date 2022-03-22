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
    <button disabled={disabled} onClick={handleClick}>
      {isLoading ? <span>loading</span> : text}
    </button>
  )
}
