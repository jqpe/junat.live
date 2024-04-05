export function Header(props: { heading: string; visuallyHidden?: boolean }) {
  return (
    <header className="mb-2">
      <h1 className={props.visuallyHidden ? 'visually-hidden' : undefined}>
        {props.heading}
      </h1>
    </header> 
  )
}
