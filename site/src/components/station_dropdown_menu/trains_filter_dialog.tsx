import type { Locale } from '~/types/common'

import { Combobox } from '@headlessui/react'
import { Formik } from 'formik'
import Fuse from 'fuse.js'
import React from 'react'

import { useStations, type LocalizedStation } from '~/lib/digitraffic'
import translate from '~/utils/translate'

import { useFilters } from '~/hooks/use_filters'
import { Dialog } from '../dialog'
import { Form } from '../form'
import { Label } from '../label'
import { PrimaryButton } from '../primary_button'

import { TimetableTypeRadio } from './timetable_type_radio'
import { useTimetableType } from '~/hooks/use_timetable_type'

const initialValues = {
  destination: '',
  timetableType: 'DEPARTURE' as 'ARRIVAL' | 'DEPARTURE'
}

type Props = {
  locale: Locale
  onSubmit: (values: { destination: string }) => void
}

export const TrainsFilterDialog = (props: Props) => {
  const { locale } = props
  const timetableTypeRadio = React.useId()

  const [isReset, setIsReset] = React.useState(false)
  const { data: stations = [] } = useStations()
  const [selectedStation, setSelectedStation] =
    React.useState<LocalizedStation>()
  const [query, setQuery] = React.useState('')
  const fuse = new Fuse(stations, {
    keys: [`stationName.${locale}`],
    threshold: 0.3
  })
  const t = translate(locale)
  const filters = useFilters(state => state.actions)

  const timetableType = useTimetableType(state => state.actions)

  const filteredStations =
    query === ''
      ? []
      : fuse.search(query, { limit: 1 }).map(result => result.item)

  return (
    <Dialog
      fixModal
      title={t('filterTrains')}
      description={t('filterTrainsDescription')}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          filters.setDestination(values.destination)

          timetableType.setType(values.timetableType)

          props.onSubmit({ destination: values.destination })
        }}
      >
        {props => {
          return (
            <Form className="flex flex-col items-start max-w-[100%]">
              <Label htmlFor="destination">{t('station')}</Label>
              <div className="min-h-[56px]">
                <Combobox
                  nullable
                  value={selectedStation ?? null}
                  onChange={station => {
                    // Station is only null if combobox is reset
                    // https://github.com/tailwindlabs/headlessui/pull/2660
                    setIsReset(station === null)
                    if (station === null) {
                      return
                    }

                    setSelectedStation(station)
                    props.setFieldValue(
                      'destination',
                      station?.stationShortCode
                    )
                  }}
                >
                  <Combobox.Input
                    className={'w-full'}
                    autoComplete="off"
                    onKeyDown={event => {
                      // Default behavior is that Enter key closes the combobox even if the combobox is reset
                      // FIXME: `closeOnReset` prop could be added to @headlessui/react Combobox since the package keeps track of the reset state,
                      // we can not control the open state ourselves (at least yet).
                      if (event.key === 'Enter' && isReset) {
                        props.setFieldValue('destination', '')
                        props.submitForm()
                      }
                    }}
                    autoCorrect="off"
                    id="destination"
                    name="destination"
                    onChange={event => setQuery(event.target.value)}
                    displayValue={(station: typeof selectedStation) =>
                      station?.stationName[locale] ?? ''
                    }
                  />
                  <Combobox.Options>
                    {filteredStations.map(station => (
                      <Combobox.Option
                        key={station.stationShortCode}
                        value={station}
                      >
                        {station.stationName[locale]}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Combobox>
              </div>

              <div className="mt-2">
                <Label htmlFor={timetableTypeRadio}>{t('trains')}</Label>
                <TimetableTypeRadio
                  id={timetableTypeRadio}
                  onValueChange={type => {
                    props.setFieldValue('timetableType', type)
                  }}
                />
              </div>

              <PrimaryButton type="submit" className="mt-2 self-end">
                {t('buttons', 'submit')}
              </PrimaryButton>
            </Form>
          )
        }}
      </Formik>
    </Dialog>
  )
}
