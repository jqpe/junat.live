import type { MqttClient } from 'mqtt'

export const hasConnected = (
  client: MqttClient,
  timeout?: number
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const connectionTimeout = setTimeout(() => {
      reject('Connection timeout exceeded.')
    }, timeout ?? 3000)

    if (client.connected) {
      clearTimeout(connectionTimeout)
      resolve(true)
      return
    }

    client.on('connect', () => {
      clearTimeout(connectionTimeout)
      resolve(true)
    })
  })
}
