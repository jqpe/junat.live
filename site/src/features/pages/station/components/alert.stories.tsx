import type { Meta, StoryFn } from '@storybook/react'
import type { AlertFragment, AlertsQuery } from '@junat/graphql/digitransit'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { graphql, http, HttpResponse } from 'msw'

import { AlertSeverityLevelType } from '@junat/graphql/digitransit'
import { transformDigitransitAlert } from '@junat/react-hooks/use_alerts'

import { Alert, Alerts } from './alert'

const meta: Meta = {
  title: 'features / pages / station / alerts',
  component: Alerts,
  parameters: {
    msw: {
      handlers: [
        http.get(
          'https://rata.digitraffic.fi/api/v1/passenger-information/active',
          () => {
            return HttpResponse.json([
              {
                id: 'SHM20250616115092843',
                version: 1,
                creationDateTime: '2025-06-16T11:50:00Z',
                startValidity: '2025-05-15T21:00:00Z',
                endValidity: '2026-07-28T20:59:00Z',
                stations: ['AIN'],
                video: {
                  text: {
                    fi: 'Raide on suljettu. Kaikki junat raiteelta 4.',
                    sv: 'Spåret är stängt. Alla tåg från spår 4.',
                    en: 'Track is closed. All trains from track 4.',
                  },
                  deliveryRules: {
                    startDateTime: '2025-05-15T21:00:00Z',
                    endDateTime: '2025-07-28T20:59:00Z',
                    startTime: '6:59',
                    endTime: '23:59',
                    weekDays: [
                      'MONDAY',
                      'TUESDAY',
                      'WEDNESDAY',
                      'THURSDAY',
                      'FRIDAY',
                      'SATURDAY',
                      'SUNDAY',
                    ],
                    deliveryType: 'CONTINUOS_VISUALIZATION',
                  },
                },
              },
            ])
          },
        ),
        graphql.query('alerts', () => {
          return HttpResponse.json({
            data: {
              stations: [{ stops: [{ alerts: [mockAlert] }], alerts: [] }],
            } as const satisfies AlertsQuery,
          })
        }),
      ],
    },
  },
  decorators: [
    Story => (
      <QueryClientProvider client={new QueryClient()}>
        <Story />
      </QueryClientProvider>
    ),
  ],
}

export default meta

const mockAlert: AlertFragment = {
  id: '1',
  alertHeaderText: 'Track maintenance',
  alertDescriptionText: 'Track maintenance work between Helsinki and Pasila.',
  alertSeverityLevel: AlertSeverityLevelType.Info,
  alertUrl: 'https://www.vr.fi/en/service-changes',
  effectiveStartDate: Date.now() / 1000,
  effectiveEndDate: Math.floor(Date.now() / 1000) + 86_400, // 24h from now
}

export const Default: StoryFn = () => (
  <Alerts stationName="Ainola" stationShortCode="AIN" />
)

export const SingleAlert: StoryFn = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Alert
      open={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      alert={transformDigitransitAlert(mockAlert)}
    />
  )
}

export const AlertWithoutUrl: StoryFn = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Alert
      open={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      alert={{ ...transformDigitransitAlert(mockAlert), url: undefined }}
    />
  )
}

export const AlertWithDefaultUrl: StoryFn = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Alert
      open={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      alert={{
        ...transformDigitransitAlert(mockAlert),
        url: 'https://hsl.fi/',
      }}
    />
  )
}
