export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  fixedToCenter?: true
}

export const Spinner = ({ fixedToCenter, ...props }: SpinnerProps) => {
  const maybeFixedToCenter = fixedToCenter ? 'fixed left-1/2 top-1/2' : ''

  return (
    <div
      className={`animate-spin duration-1000 ${maybeFixedToCenter} bg-secondary-500 w-6 p-[3px] aspect-[1] 
      rounded-full [mask-composite:source-out] [mask:conic-gradient(#0000_10%,#000),_linear-gradient(#000_0_0)_content-box]`}
      {...props}
    />
  )
}
