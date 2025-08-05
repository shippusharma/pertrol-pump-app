# 📱 Local Android APK Build Guide

This guide will help you build Android APKs locally without using EAS Build.

## ✅ Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- Java 11 or higher
- Android Studio with Android SDK
- Android NDK (if not already installed via Android Studio)

## 🚀 Quick Build Commands

### Build Release APK

```bash
bun run build:android:apk
```

### Build Debug APK (for testing)

```bash
bun run build:android:debug
```

### Build AAB (for Play Store)

```bash
bun run build:android:aab
```

## 📦 Step-by-Step Build Process

### 1. Install Dependencies

```bash
bun install
```

### 2. Bundle JavaScript and Assets

```bash
bun run bundle:android
```

### 3. Build APK

```bash
cd android
./gradlew assembleRelease
```

## 📍 Output Locations

After successful build, you'll find your APK at:

- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **AAB**: `android/app/build/outputs/bundle/release/app-release.aab`

## 🧹 Clean Build

If you encounter build issues, clean and rebuild:

```bash
# Clean Android build
bun run clean:android

# Clean everything
bun run clean:all

# Rebuild
bun run build:android:apk
```

## 🔧 Troubleshooting

### Common Issues:

1. **"gradlew: Permission denied"**

   ```bash
   chmod +x android/gradlew
   ```

2. **"SDK location not found"**
   - Open Android Studio
   - Go to Settings/Preferences → Appearance & Behavior → System Settings → Android SDK
   - Copy the Android SDK Location path
   - Set environment variable: `export ANDROID_HOME=/path/to/your/android/sdk`

3. **"Java version incompatible"**

   ```bash
   # Check Java version
   java -version

   # If needed, install Java 11
   # On macOS: brew install openjdk@11
   # On Ubuntu: sudo apt install openjdk-11-jdk
   ```

4. **"Metro bundler not found"**
   ```bash
   npm install -g @react-native-community/cli
   ```

## 📱 Installing on Your Phone

1. **Enable Developer Options** on your Android phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect your phone** via USB

3. **Install the APK**:

   ```bash
   # For release APK
   adb install android/app/build/outputs/apk/release/app-release.apk

   # For debug APK
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

## 🔐 Signing for Release

For production releases, you'll need to create a keystore:

1. **Generate keystore**:

   ```bash
   keytool -genkey -v -keystore android/app/release-key.keystore -alias your-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Create `android/gradle.properties`** (if not exists):

   ```properties
   MYAPP_RELEASE_STORE_FILE=release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=your-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=your-store-password
   MYAPP_RELEASE_KEY_PASSWORD=your-key-password
   ```

3. **Update `android/app/build.gradle`**:
   ```gradle
   signingConfigs {
       release {
           storeFile file(MYAPP_RELEASE_STORE_FILE)
           storePassword MYAPP_RELEASE_STORE_PASSWORD
           keyAlias MYAPP_RELEASE_KEY_ALIAS
           keyPassword MYAPP_RELEASE_KEY_PASSWORD
       }
   }
   buildTypes {
       release {
           signingConfig signingConfigs.release
           // ... other configs
       }
   }
   ```

## 📊 Build Variants

- **Debug**: `./gradlew assembleDebug` - For development and testing
- **Release**: `./gradlew assembleRelease` - For production distribution
- **Bundle**: `./gradlew bundleRelease` - For Play Store submission

## 🎯 Tips

1. **Always test on a physical device** before releasing
2. **Use debug builds** for development and testing
3. **Use release builds** for distribution
4. **Keep your keystore safe** - losing it means you can't update your app
5. **Test thoroughly** before releasing to users

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Clean and rebuild: `npm run clean:all && npm run build:android:apk`
3. Check Android Studio logs for detailed error messages
