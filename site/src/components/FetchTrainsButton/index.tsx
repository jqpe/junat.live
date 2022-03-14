interface FetchTrainsButtonProps {
  disabled: boolean
  handleClick: VoidFunction
  visible: boolean
}

export default function FetchTrainsButton({
  disabled,
  handleClick,
  visible
}: FetchTrainsButtonProps) {
  if (!visible) {
    return null
  }

  return (
    <button disabled={disabled} onClick={handleClick}>
      load more
    </button>
  )
}
