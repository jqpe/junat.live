import { getMqttUri } from '../../src/base/get_mqtt_uri'

import { it, expect } from 'vitest'

it('returns topic string followed by # if all options are unset', () => {
  expect(getMqttUri('trains/', {})).toStrictEqual('trains/#')
})

it('replaces plus signs with values', () => {
  expect(getMqttUri('trains/', { trainNumber: 1 })).toContain('1')
})

it('treats undefined properties as omitted', () => {
  expect(getMqttUri('trains/', { commuterLine: undefined })).toStrictEqual(
    'trains/#'
  )
})
