import { getUrl } from '../../src/base/get_url'

import { it, expect } from 'vitest'

const DIGITRAFFIC_API_URL = 'https://rata.digitraffic.fi/api/v1'

it("returns an url relative to digitraffic's api url by default", () => {
  expect(getUrl('/metadata/stations')).toStrictEqual(
    `${DIGITRAFFIC_API_URL}/metadata/stations`
  )
})

it('appends url search parameters if given as a parameter', () => {
  expect(
    getUrl('/trains', new URLSearchParams({ trainNumber: '1' }))
  ).toStrictEqual(`${DIGITRAFFIC_API_URL}/trains?trainNumber=1`)
})
