export function Header(props: { heading: string; visuallyHidden?: boolean }) {
  return (
    <div className="mb-2">
      <h1 className={props.visuallyHidden ? 'sr-only' : ''}>{props.heading}</h1>
    </div>
  )
}
