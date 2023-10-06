export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  fixedToCenter?: true
  /**
   * Classes specified will be overwritten, do not use. Instead, use the `style` attribute for one-off styles.
   */
  className?: undefined
}

export const Spinner = ({ fixedToCenter, ...props }: SpinnerProps) => {
  const maybeFixedToCenter = fixedToCenter ? 'fixed left-1/2 top-1/2' : ''

  return (
    <div
      {...props}
      className={`animate-spin duration-1000 ${maybeFixedToCenter} bg-secondary-500 w-6 p-[3px] aspect-[1] 
      rounded-full [mask-composite:source-out] [mask:conic-gradient(#0000_10%,#000),_linear-gradient(#000_0_0)_content-box]`}
    />
  )
}
