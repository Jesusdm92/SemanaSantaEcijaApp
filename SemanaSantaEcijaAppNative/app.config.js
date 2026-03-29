export default {
  "expo": {
    "name": "Cruz de Guía Écija",
    "slug": "cruz-de-guia-ecija",
    "version": "1.0.2",
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
      "icon": "./assets/icon-ios.png",
      "supportsTablet": true,
      "bundleIdentifier": "com.jesusdm92.semanasantaecijaapp",
      "buildNumber": "3",
      "infoPlist": {
        "NSCameraUsageDescription": "La aplicación necesita acceso a la cámara para que puedas tomar fotos de las hermandades y compartirlas.",
        "NSPhotoLibraryUsageDescription": "Se necesita acceso a la galería para que puedas seleccionar y compartir imágenes de la Semana Santa.",
        "NSPhotoLibraryAddUsageDescription": "La aplicación necesita permiso para guardar en tu dispositivo las imágenes de las procesiones."
      }
    },
    "android": {
      "package": "com.jesusdm92.semanasantaecijaapp",
      "versionCode": 3,
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