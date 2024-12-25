import 'dotenv/config';

export default {
  expo: {
    name: 'AirTrack',
    slug: 'airtrack',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.airtrack.app'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.airtrack.app'
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      rapidApiKey: process.env.RAPID_API_KEY
    }
  }
}; 