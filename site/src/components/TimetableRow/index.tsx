import type { LocalizedStation, TimetableRow } from '~digitraffic'

export interface TimetableRowProps {
  commuterLineId?: string
  locale: 'fi' | 'en' | 'sv'
  stations: LocalizedStation[]
  stationShortCode: string
  timetableRows: TimetableRow[]
}

export default function TimetableRow({
  commuterLineId,
  locale,
  stations,
  stationShortCode,
  timetableRows
}: TimetableRowProps) {
  const timetableRow = timetableRows.find(
    tr => tr.stationShortCode === stationShortCode && tr.type === 'ARRIVAL'
  )
  const destinationTimetableRow = timetableRows.at(-1)

  if (!timetableRow) {
    return <></>
  }

  const formatTime = (dateString: string) =>
    Intl.DateTimeFormat('fi', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(Date.parse(dateString))

  const { scheduledTime, liveEstimateTime } = {
    scheduledTime: formatTime(timetableRow.scheduledTime),
    liveEstimateTime: timetableRow.liveEstimateTime
      ? formatTime(timetableRow.liveEstimateTime)
      : undefined
  }

  const station = stations.find(
    station =>
      station.stationShortCode === destinationTimetableRow?.stationShortCode
  )

  if (!station) {
    throw new Error(
      `Station could not be found for ${destinationTimetableRow?.stationShortCode}`
    )
  }

  return (
    <tr>
      <td>{station.stationName[locale]}</td>

      <td>
        <time dateTime={timetableRow.scheduledTime}>{scheduledTime}</time>
        {liveEstimateTime && liveEstimateTime > scheduledTime && (
          <time dateTime={timetableRow.liveEstimateTime}>
            {liveEstimateTime}
          </time>
        )}
      </td>
      <td>{timetableRow.commercialTrack}</td>
      <td>{commuterLineId}</td>
    </tr>
  )
}
