import { getStationPath, LocalizedStation, Train } from '~digitraffic'

import Link from 'next/link'

export interface TimetableRowProps {
  train: Train
  locale: 'fi' | 'en' | 'sv'
  stations: LocalizedStation[]
  stationShortCode: string
}

export default function TimetableRow({
  locale,
  stations,
  stationShortCode,
  train
}: TimetableRowProps) {
  const timetableRow = train.timeTableRows.find(
    tr => tr.stationShortCode === stationShortCode && tr.type === 'DEPARTURE'
  )
  const destinationTimetableRow = train.timeTableRows.at(-1)

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
      <td>
        <Link href={`/${getStationPath(station.stationName[locale]!)}`}>
          {station.stationName[locale]}
        </Link>
      </td>

      <td>
        <time dateTime={timetableRow.scheduledTime}>{scheduledTime}</time>
        {liveEstimateTime && liveEstimateTime > scheduledTime && (
          <time dateTime={timetableRow.liveEstimateTime}>
            {liveEstimateTime}
          </time>
        )}
      </td>
      <td>{timetableRow.commercialTrack}</td>
      <td>
        {train.commuterLineID || `${train.trainType}${train.trainNumber}`}
      </td>
    </tr>
  )
}
