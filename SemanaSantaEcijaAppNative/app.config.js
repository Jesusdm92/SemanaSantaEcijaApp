export default {
  "expo": {
    "name": "Cruz de Guía Écija",
    "slug": "cruz-de-guia-ecija",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon-optimized.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash-2026.jpg",
      "resizeMode": "cover",
      "backgroundColor": "#000000"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "package": "com.jesusdm92.semanasantaecijaapp",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon-optimized.png",
        "backgroundColor": "#4b0082"
      },
      // Si existe la variable de entorno del secreto, la usamos. Si no, usamos el archivo local.
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON || "./google-services.json"
    },
    "web": {
      "bundler": "metro"
    },
    "extra": {
      "eas": {
        "projectId": "6e68a564-6466-4c27-bd38-25c6c2adc84f"
      }
    },
    "plugins": [
      "expo-font",
      "expo-asset",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#d4af37",
          "defaultChannel": "alertas"
        }
      ]
    ]
  }
};