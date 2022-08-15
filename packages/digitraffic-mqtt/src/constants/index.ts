export const MQTT_URL = (() => {
  if ('process' in globalThis && /(test|ci)/i.test(`${process.env.NODE_ENV}`)) {
    return 'mqtt://127.0.0.1:1883'
  }

  return 'wss://rata.digitraffic.fi/mqtt'
})()
