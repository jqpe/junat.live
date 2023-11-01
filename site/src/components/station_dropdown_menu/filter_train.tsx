import { memo } from 'react'
import { Dialog } from '../dialog'

export const FilterTrain = memo(function FilterTrain() {
  return (
    <Dialog
      title="Filter trains"
      description="Filter trains by departure time, destination or train."
    />
  )
})
