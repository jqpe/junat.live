import type { Train } from '~digitraffic'

import SingleTimetableRow from '@components/SingleTimetableRow'

export default function SingleTimetable({
  timetableRows
}: {
  timetableRows: Train['timeTableRows']
}) {
  return (
    <table>
      <tbody>
        {timetableRows
          .filter(tr => tr.type === 'DEPARTURE')
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
