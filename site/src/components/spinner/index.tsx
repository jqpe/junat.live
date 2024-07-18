import { cva, cx } from 'cva'

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  fixedToCenter?: true
  /**
   * Classes specified will be overwritten, do not use. Instead, use the `style` attribute for one-off styles.
   */
  className?: undefined
}
const spinner = cva({
  base: cx(
    `aspect-[1] w-6 animate-spin rounded-full duration-1000`,
    'bg-secondary-500 p-[3px] [-webkit-mask-composite:source-out]',
    '[-webkit-mask:conic-gradient(#0000_10%,#000),_linear-gradient(#000_0_0)_content-box]',
    'supports-[mask-composite:subtract]:[mask-composite:subtract]',
  ),
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
