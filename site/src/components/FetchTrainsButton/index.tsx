interface FetchTrainsButtonProps {
  disabled: boolean
  handleClick: VoidFunction
  text: string
  visible: boolean
}

export default function FetchTrainsButton({
  disabled,
  handleClick,
  text,
  visible
}: FetchTrainsButtonProps) {
  if (!visible) {
    return null
  }

  return (
    <button disabled={disabled} onClick={handleClick}>
      {text}
    </button>
  )
}
