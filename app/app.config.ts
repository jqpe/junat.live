import type { ConfigContext, ExpoConfig } from 'expo/config'

const icon = './assets/icon.png'

const app = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'expo',
  slug: 'expo',
  scheme: 'expo',
  version: '0.1.0',
  orientation: 'portrait',
  icon,
  userInterfaceStyle: 'automatic',
  splash: {
    image: icon,
    resizeMode: 'contain',
    backgroundColor: '#1F104A',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'live.junat.app',
    supportsTablet: true,
  },
  android: {
    package: 'live.junat.app',
    adaptiveIcon: {
      foregroundImage: icon,
      backgroundColor: '#1F104A',
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: ['expo-router'],
})

export default app
