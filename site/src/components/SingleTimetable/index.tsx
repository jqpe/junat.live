import type { Train } from '~digitraffic'

import SingleTimetableRow from '@components/SingleTimetableRow'

import styles from './SingleTimetable.module.scss'

export default function SingleTimetable({
  timetableRows
}: {
  timetableRows: Train['timeTableRows']
}) {
  return (
    <table className={styles.timetable}>
      <tbody>
        {timetableRows
          .filter(
            (tr, i) =>
              (tr.type === 'DEPARTURE' || i === timetableRows.length - 1) &&
              tr.commercialStop
          )
          .map(timetableRow => (
            <SingleTimetableRow
              key={timetableRow.liveEstimateTime || timetableRow.scheduledTime}
              timetableRow={timetableRow}
            />
          ))}
      </tbody>
    </table>
  )
}
