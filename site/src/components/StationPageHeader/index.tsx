interface StationPageHeaderProps {
  heading?: string
}

export default function StationPageHeader({ heading }: StationPageHeaderProps) {
  return (
    <header>
      <h1>{heading}</h1>
    </header>
  )
}
