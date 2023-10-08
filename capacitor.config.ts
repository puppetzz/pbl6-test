import { type CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'pbl-6',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    url: 'http://10.0.102.19:3000',
    cleartext: true
  }
}

export default config
