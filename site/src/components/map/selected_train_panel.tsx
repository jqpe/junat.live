import type { TrainLayerHandle } from './train_layer'

import { memo, useEffect } from 'react'
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

  useEffect(() => {
    const handleClose = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleClose)

    return () => window.removeEventListener('keydown', handleClose)
  }, [])

  if (!selectedTrain) {
    return null
  }

  return (
    <div
      role="dialog"
      className={cx(
        'absolute inset-x-0 bottom-0 h-1/2 overflow-auto lg:animate-scaleIn',
        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
        'lg:h-4/3 lg:top-[var(--header-height)] lg:m-4 lg:w-1/3 lg:rounded-2xl',
      )}
    >
      <div
        className={cx(
          'sticky top-0 z-50 flex justify-between px-4 py-2',
          'dark:fill-white bg-gray-900 border-b-gray-800 border-b',
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

      <div className="px-2 py-2 pb-20 lg:pb-2">
        <SingleTimetable timetableRows={selectedTrain.timetableRows} />
      </div>
    </div>
  )
})
