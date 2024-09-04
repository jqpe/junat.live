import { cx } from 'cva'

export function Header(props: {
  heading: string
  visuallyHidden?: boolean
  className?: string
}) {
  return (
    <h1
      className={cx(
        props.visuallyHidden ? 'sr-only' : '',
        props.className ?? 'mb-2',
      )}
    >
      {props.heading}
    </h1>
  )
}
