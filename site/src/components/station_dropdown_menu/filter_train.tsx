import type { Locale } from '~/types/common'

import { Combobox } from '@headlessui/react'
import { Formik } from 'formik'
import Fuse from 'fuse.js'
import React, { Fragment } from 'react'

import { type LocalizedStation, useStations } from '~/lib/digitraffic'
import translate from '~/utils/translate'

import { Dialog } from '../dialog'
import { Form } from '../form'
import { Label } from '../label'
import { PrimaryButton } from '../primary_button'
import { useFilters } from '~/hooks/use_filters'

const initialValues = { destination: '' }

type Props = {
  locale: Locale
}

export const FilterTrain = (props: Props) => {
  const { locale } = props

  const { data: stations = [] } = useStations()
  const [selectedStation, setSelectedStation] =
    React.useState<LocalizedStation | null>(null)
  const [query, setQuery] = React.useState('')
  const fuse = new Fuse(stations, {
    keys: [`stationName.${locale}`],
    threshold: 0.3
  })
  const t = translate(locale)
  const filters = useFilters(state => state.actions)

  const filteredStations =
    query === ''
      ? []
      : fuse.search(query, { limit: 1 }).map(result => result.item)

  return (
    <Dialog
      title="Filter trains"
      description="Filter trains by departure time, destination or train."
    >
      <Formik
        initialValues={initialValues}
        onSubmit={values => filters.setDestination(values.destination)}
      >
        {props => {
          return (
            <Form className="flex flex-col items-start max-w-[100%]">
              <Label htmlFor="destination">Destination</Label>
              <Combobox
                value={selectedStation}
                onChange={station => {
                  setSelectedStation(station)
                  props.setFieldValue('destination', station?.stationShortCode)
                }}
              >
                <div className="w-[100%]">
                  <div className="flex justify-between">
                    <Combobox.Input
                      id="destination"
                      name="id"
                      onChange={event => setQuery(event.target.value)}
                      displayValue={(station: typeof selectedStation) =>
                        station?.stationName.en ?? ''
                      }
                    />
                  </div>
                  <div>
                    <Combobox.Options>
                      {filteredStations.map(station => (
                        <Combobox.Option
                          key={station.stationShortCode}
                          value={station}
                          as={Fragment}
                        >
                          {({ active }) => {
                            return (
                              <li
                                data-active={active}
                                className="data-[active=true]:bg-secondaryA-200"
                              >
                                {station.stationName.en}
                              </li>
                            )
                          }}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </div>
                </div>
              </Combobox>
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
