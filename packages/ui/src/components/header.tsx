export function Header(props: { heading: string; visuallyHidden?: boolean }) {
  return (
    <div className="mb-2">
      <h1 className={props.visuallyHidden ? 'visually-hidden' : ''}>
        {props.heading}
      </h1>
    </div>
  )
}
