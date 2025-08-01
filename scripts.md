```json
"scripts": {
  // 🚀 Dev & Platform Start
  "dev": "EXPO_NO_TELEMETRY=1 expo start",
  "start": "expo start",
  "android": "expo run:android",
  "ios": "expo run:ios",
  "web": "expo start --web",

  // 🧪 Linting & Cleanup
  "lint": "expo lint",
  "clean": "rm -rf node_modules .expo .expo-shared dist android/build ios/build && yarn cache clean",

  // 🔁 Reset
  "reset-project": "node ./scripts/reset-project.js",
  "reset": "expo start -c", // clear cache

  // 🛠️ Prebuild (for bare workflows or EAS Build)
  "prebuild": "expo prebuild",

  // 📦 Build with EAS
  "build:android": "eas build --platform android",
  "build:android:apk": "eas build --platform android --profile preview",
  "build:android:aab": "eas build --platform android --profile production",
  "build:ios": "eas build --platform ios",
  "build:ios:simulator": "eas build --platform ios --profile simulator",

  // 🚀 Submit to Stores
  "submit:android": "eas submit --platform android",
  "submit:ios": "eas submit --platform ios",

  // 🛰️ OTA Updates
  "update": "eas update --branch preview --message \"Manual update\"",
  "update:prod": "eas update --branch production --message \"Production update\"",

  // 🧪 Test (if using Jest or Detox)
  "test": "jest",

  // 📄 Info
  "whoami": "eas whoami",
  "doctor": "expo doctor"
}
```

<br/>
<br/>
<br/>
<br/>


```txt
Notes & Dependencies
Install EAS CLI if not already:

npm install -g eas-cli
Initialize EAS if not already:

eas init
Profiles setup:
In your eas.json, define multiple profiles:

{
  "build": {
    "production": {
      "releaseChannel": "production",
      "developmentClient": false
    },
    "preview": {
      "distribution": "internal",
      "developmentClient": true
    },
    "simulator": {
      "ios": {
        "simulator": true
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```