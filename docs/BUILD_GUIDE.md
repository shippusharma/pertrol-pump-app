# 📦 React Native Expo (Bare Workflow) – Local Build Guide

This guide walks you through how to build your **Expo** app for **Android (.apk/.aab)** and **iOS (.ipa)** without using EAS Build. This uses the **bare workflow**, giving you full native control via Android Studio and Xcode.

---

## ✅ Prerequisites

- Node.js, npm/yarn installed
- Expo CLI installed globally: `npm install -g expo-cli`
- Xcode (macOS only) for iOS builds
- Android Studio for Android builds
- Java 11+ for Android Gradle builds
- A physical Mac for `.ipa` and App Store builds

---

## ⚙️ 1. Eject to Bare Workflow

```bash
npx expo eject
```

This will:

- Create `android/` and `ios/` directories
- Switch your project to the **bare workflow**
- Install `react-native` and native dependencies

---

## 📦 2. Install Dependencies

```bash
npm install
npx pod-install  # For iOS (runs pod install under ios/)
```

---

## 🤖 Android Build

### 🧩 A. Bundle JavaScript + Assets

```bash
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res/
```

If `assets/` doesn't exist yet:

```bash
mkdir -p android/app/src/main/assets
```

---

### 🏗️ B. Build APK

```bash
cd android
./gradlew assembleRelease
```

**Output:**

```
android/app/build/outputs/apk/release/app-release.apk
```

---

### 📦 C. Build AAB (Play Store)

```bash
cd android
./gradlew bundleRelease
```

**Output:**

```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🍏 iOS Build (macOS Only)

### 🧩 A. Bundle JavaScript + Assets

```bash
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios
```

---

### 🛠️ B. Open Xcode Workspace

```bash
open ios/YourApp.xcworkspace
```

- Set your signing team and bundle ID in Xcode
- Select "Generic iOS Device" or a physical device
- Product > Archive

---

### 📤 C. Export `.ipa` from Organizer

After archiving:

1. Open Organizer (auto-pops)
2. Click "Distribute App"
3. Choose "App Store Connect" or "Export for Ad Hoc"

---

## 📜 Helpful Scripts (Add to package.json)

```json
"scripts": {
  "android:build-apk": "cd android && ./gradlew assembleRelease",
  "android:build-aab": "cd android && ./gradlew bundleRelease",
  "ios:build": "cd ios && xcodebuild -workspace YourApp.xcworkspace -scheme YourApp -configuration Release",
  "bundle:android": "react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/",
  "bundle:ios": "react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle --assets-dest ios"
}
```

---

## 🧹 Clean Build Tips

```bash
cd android
./gradlew clean
```

For iOS:

```bash
cd ios
xcodebuild clean
```

---

## ✅ Summary

| Platform | Output Type | Build Command               |
| -------- | ----------- | --------------------------- |
| Android  | `.apk`      | `./gradlew assembleRelease` |
| Android  | `.aab`      | `./gradlew bundleRelease`   |
| iOS      | `.ipa`      | Archive via Xcode           |

---

## 🧑‍💻 Notes

- Always test on physical devices before release.
- For Play Store, use `.aab`; for internal installs, use `.apk`.
- For App Store, only `.ipa` via Archive & Xcode Organizer is accepted.
