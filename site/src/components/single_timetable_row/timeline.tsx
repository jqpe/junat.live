import { cva, cx } from 'cva'

interface TimelineProps {
  lastHasDeparted: boolean
  lastRow: boolean
  firstRow: boolean
}
export function Timeline(props: TimelineProps) {
  const { firstRow, lastHasDeparted, lastRow } = props

  return (
    <td className="relative -mb-2 -mt-0.5">
      <TrackSection
        firstRow={firstRow}
        lastRow={lastRow}
        lastHasDeparted={lastHasDeparted}
      />

      <Circle />
    </td>
  )
}

function Circle() {
  return (
    <svg
      preserveAspectRatio="xMinYMin slice"
      className="absolute inset-0 z-20 h-full w-full"
      viewBox="0 0 100 100"
    >
      <circle
        className={cx(
          'fill-gray-500 group-data-[departed=true]:fill-primary-600 dark:fill-gray-700',
          'group-data-[departed=true]:dark:fill-primary-500',
        )}
        cx={14}
        cy={25}
        r={9}
      />
    </svg>
  )
}

function TrackSection(
  props: Pick<TimelineProps, 'firstRow' | 'lastRow'> &
    Partial<Pick<TimelineProps, 'lastHasDeparted'>>,
) {
  const { firstRow, lastHasDeparted, lastRow } = props

  const track = cva({
    base: cx(
      'absolute inset-0 z-10 h-full w-full bg-gray-500 dark:bg-gray-600',
      'ml-[6.5px] w-[5px] group-data-[departed=true]:bg-primary-600',
      'dark:group-data-[departed=true]:bg-primary-500',
      lastRow && 'h-[20px]',
      firstRow && 'mt-[20px]',
    ),
    variants: {
      lastHasDeparted: {
        true: cx(
          'bg-gradient-to-b fill-[currentColor] group-data-[departed=true]:from-primary-600',
          'group-data-[departed=true]:to-gray-500 dark:group-data-[departed=true]:from-primary-500',
          'to-50% dark:group-data-[departed=true]:to-gray-600',
        ),
      },
    },
  })

  return <div className={track({ lastHasDeparted })} />
}
