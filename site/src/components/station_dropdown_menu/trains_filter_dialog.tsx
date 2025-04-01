import type { LocalizedStation } from '~/lib/digitraffic'
import type { Locale } from '~/types/common'

import React from 'react'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import { cx } from 'cva'
import { Formik } from 'formik'
import Fuse from 'fuse.js'
import { AnimatePresence, motion } from 'motion/react'

import { useStations } from '@junat/react-hooks/digitraffic'
import { useStationFilters } from '@junat/react-hooks/use_filters'
import { useStationPage } from '@junat/react-hooks/use_station_page'
import { useTimetableType } from '@junat/react-hooks/use_timetable_type'
import { Button } from '@junat/ui/components/button'
import { Dialog } from '@junat/ui/components/dialog'
import { Form } from '@junat/ui/components/form/index'
import { Label } from '@junat/ui/components/form/label'
import Close from '@junat/ui/icons/close.svg'

import { translate } from '~/i18n'
import { TimetableTypeRadio } from './timetable_type_radio'

type Props = {
  locale: Locale
  currentStation: string
  onSubmit: (values: { destination: string }) => void
}

export const TrainsFilterDialog = (props: Props) => {
  const { locale, currentStation } = props
  const timetableTypeRadio = React.useId()

  const { data: stations = [] } = useStations({ t: translate('all') })
  const [selectedStation, setSelectedStation] =
    React.useState<LocalizedStation>()
  const [query, setQuery] = React.useState('')
  const fuse = new Fuse(
    stations.filter(station => station.stationShortCode !== currentStation),
    {
      keys: [`stationName.${locale}`],
      threshold: 0.3,
    },
  )
  const t = translate(locale)

  const currentShortCode = useStationPage(state => state.currentShortCode)
  const filters = useStationFilters(currentShortCode)

  const timetableType = useTimetableType(state => state.actions)

  const filteredStations =
    query === ''
      ? []
      : fuse.search(query, { limit: 1 }).map(result => result.item)

  const initialValues = {
    destination: selectedStation?.stationShortCode ?? '',
    timetableType: 'DEPARTURE' as 'ARRIVAL' | 'DEPARTURE',
  }

  return (
    <Dialog
      Close={Close}
      t={t}
      fixModal
      // Allows browsers to adjust dialog to visible viewport when using virtual keyboard.
      onOpenAutoFocus={event => {
        event.preventDefault()

        // Wrapping with reqest animation frame does not break the layout on Safari on iOS
        window.requestAnimationFrame(() => {
          if (event.target instanceof HTMLElement) {
            const input = event.target.querySelector('form input')
            if (input instanceof HTMLInputElement) input.focus()
          }
        })
      }}
      title={t('filterTrains')}
      description={t('filterTrainsDescription')}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          filters.setDestination(values.destination)

          timetableType.setType(values.timetableType)

          // Reset virtual keyboard scroll
          window.scrollTo(0, 0)

          props.onSubmit({ destination: values.destination })
        }}
      >
        {props => {
          const currentStationLocalized = stations.find(
            station => station.stationShortCode === currentStation,
          )?.stationName[locale]

          const targetStationLocalized = stations.find(
            station =>
              station.stationShortCode === selectedStation?.stationShortCode,
          )?.stationName[locale]

          return (
            <Form className="flex max-w-[100%] flex-col items-start">
              <Label htmlFor="destination">{t('station')}</Label>
              <div className="min-h-[56px] w-full">
                <Combobox
                  value={selectedStation ?? null}
                  onChange={station => {
                    setSelectedStation(station ?? undefined)

                    props.setFieldValue(
                      'destination',
                      station?.stationShortCode ?? '',
                    )
                  }}
                >
                  <ComboboxInput
                    onFocus={event => {
                      event.currentTarget.select()
                    }}
                    // Allow submitting form even if destination is empty.
                    onKeyDown={event => {
                      if (event.key === 'Enter' && query === '') {
                        props.setFieldValue('destination', '')
                        props.submitForm()
                      }
                    }}
                    className={cx(
                      'focus-visible:border-blue-500 relative w-full border-b-[1px]',
                      'border-b-gray-200 text-[1rem] dark:border-b-gray-700',
                    )}
                    autoComplete="off"
                    autoCorrect="off"
                    id="destination"
                    name="destination"
                    onChange={event => setQuery(event.target.value)}
                    displayValue={(station: typeof selectedStation) =>
                      station?.stationName[locale] ?? ''
                    }
                  />
                  <ComboboxOptions>
                    {filteredStations.map(station => (
                      <ComboboxOption
                        key={station.stationShortCode}
                        value={station}
                      >
                        {station.stationName[locale]}
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                </Combobox>
              </div>

              <AnimatePresence>
                {currentStationLocalized && targetStationLocalized && (
                  <motion.div
                    className="mt-2"
                    initial={{ opacity: 0, translateY: 4 }}
                    animate={{ opacity: 1, translateY: 0 }}
                  >
                    <Label htmlFor={timetableTypeRadio}>{t('trains')}</Label>
                    <TimetableTypeRadio
                      targetStation={targetStationLocalized}
                      currentStation={currentStationLocalized}
                      id={timetableTypeRadio}
                      onValueChange={type => {
                        props.setFieldValue('timetableType', type)
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-2 self-end">
                <Button type="submit">{t('buttons.applyFilters')}</Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </Dialog>
  )
}
