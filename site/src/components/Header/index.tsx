interface HeaderProps {
  heading?: string
}

export default function Header({ heading }: HeaderProps) {
  return (
    <header>
      <h1>{heading}</h1>
    </header>
  )
}
