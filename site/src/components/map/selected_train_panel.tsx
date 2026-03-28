import type { TrainLayerHandle } from './train_layer'

import { memo } from 'react'
import { cx } from 'cva'

import { getTrainTitle } from '@junat/core'
import Close from '@junat/ui/icons/close.svg'

import SingleTimetable from '~/components/single_timetable'
import { useTranslations } from '~/i18n'

interface SelectedTrainPanelProps {
  selectedTrain: ReturnType<TrainLayerHandle['getSelectedTrain']>
  onClose: () => void
}

export const SelectedTrainPanel = memo(function SelectedTrainPanel({
  selectedTrain,
  onClose,
}: SelectedTrainPanelProps) {
  const t = useTranslations()
  const { trainTitle } = getTrainTitle(
    {
      trainNumber: selectedTrain?.trainNumber || 0,
      trainType: { name: selectedTrain?.trainType || 'unknown' },
    },
    t,
  )

  if (!selectedTrain) {
    return null
  }

  return (
    <div className="h-[50vh] overflow-auto">
      <div
        className={cx(
          'sticky top-0 z-50 flex justify-between bg-gray-200 px-4 py-2 text-gray-800',
          'dark:bg-gray-800 dark:fill-white dark:text-gray-100',
        )}
      >
        {trainTitle}
        <button
          className="flex h-8 w-8 items-center justify-center"
          onClick={onClose}
        >
          <Close />
        </button>
      </div>

      <div className="px-2 py-2 pb-20">
        <SingleTimetable timetableRows={selectedTrain.timetableRows} />
      </div>
    </div>
  )
})
