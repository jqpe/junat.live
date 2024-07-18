import { cva } from 'cva'

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  fixedToCenter?: true
  /**
   * Classes specified will be overwritten, do not use. Instead, use the `style` attribute for one-off styles.
   */
  className?: undefined
}
const spinner = cva({
  base: 'spinner',
  variants: {
    variant: {
      fixedToCenter: 'fixed left-1/2 top-1/2',
    },
  },
})

export const Spinner = ({ fixedToCenter, ...props }: SpinnerProps) => {
  const className = spinner({
    variant: fixedToCenter ? 'fixedToCenter' : undefined,
  })

  return <div {...props} className={className} />
}
