import type { Meta, StoryFn } from '@storybook/react'
import type { AlertFragment, AlertsQuery } from '@junat/graphql/digitransit'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { graphql, HttpResponse } from 'msw'

import { AlertSeverityLevelType } from '@junat/graphql/digitransit'

import { Alert, Alerts } from './alert'

const meta: Meta = {
  title: 'features / pages / station / alerts',
  component: Alerts,
  decorators: [
    Story => (
      <QueryClientProvider client={new QueryClient()}>
        {/* has default negative margin  */}
        <div className="mt-4">
          <Story />
        </div>
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

export const Default: StoryFn = () => <Alerts stationShortCode="AIN" />

Default.parameters = {
  msw: {
    handlers: [
      graphql.query('alerts', () => {
        return HttpResponse.json({
          data: {
            stations: [{ stops: [{ alerts: [mockAlert] }] }],
          } as const satisfies AlertsQuery,
        })
      }),
    ],
  },
}

export const Multiple: StoryFn = () => <Alerts stationShortCode="AIN" />

Multiple.parameters = {
  msw: {
    handlers: [
      graphql.query('alerts', () => {
        return HttpResponse.json({
          data: {
            stations: [
              {
                stops: [
                  {
                    alerts: [
                      mockAlert,
                      { ...mockAlert, id: crypto.randomUUID() },
                    ],
                  },
                ],
              },
            ],
          } as const satisfies AlertsQuery,
        })
      }),
    ],
  },
}

export const SingleAlert: StoryFn = () => <Alert alert={mockAlert} />

export const AlertWithoutUrl: StoryFn = () => (
  <Alert alert={{ ...mockAlert, alertUrl: null }} />
)
export const AlertWithDefaultUrl: StoryFn = () => (
  <Alert alert={{ ...mockAlert, alertUrl: 'https://hsl.fi/' }} />
)
