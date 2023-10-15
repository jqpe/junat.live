import { getMqttTopicString } from '~/base/get_mqtt_topic_string'

import { it, expect } from 'vitest'

it('returns topic string followed by # if all options are unset', () => {
  expect(getMqttTopicString('trains/', {})).toStrictEqual('trains/#')
})

it('replaces plus signs with values', () => {
  expect(getMqttTopicString('trains/', { trainNumber: 1 })).toContain('1')
})

it('treats undefined properties as omitted', () => {
  expect(
    getMqttTopicString('trains/', { commuterLine: undefined })
  ).toStrictEqual('trains/#')
})
