# Screenshots Placeholder

This folder contains visual assets for the README documentation.

## Required Files

### Screen Recording

**Filename:** `app-demo.mp4`

**What to record:**

1. App launch and home screen
2. Navigate to login page
3. Demo login flow (tap "🎭 Explore as Demo User")
4. Show account screen with user details
5. Toggle dark mode (sun/moon icon)
6. Navigate through tabs (Home, Explore)
7. Show biometric login prompt (if available)
8. Logout and return to home

**Recommended specs:**

- Duration: 30-60 seconds
- Resolution: 720p or 1080p
- Format: MP4 (H.264 codec)
- Frame rate: 30fps
- Show device frame: Optional

**Tools for recording:**

- **iOS:** QuickTime Player (Mac) or built-in screen recording
- **Android:** ADB screen record or built-in screen recorder
- **Emulator:** OBS Studio or similar

---

## Recording Instructions

### iOS Device

1. Open Settings → Control Center
2. Add "Screen Recording" if not present
3. Swipe down Control Center
4. Long-press Screen Recording icon
5. Select microphone option (if needed)
6. Tap "Start Recording"
7. Navigate through app flow
8. Stop recording from status bar

### Android Device

1. Swipe down notification panel twice
2. Tap "Screen Record" tile
3. Choose audio option
4. Tap "Start"
5. Navigate through app flow
6. Tap stop notification

### iOS Simulator (Mac)

```bash
xcrun simctl io booted recordVideo app-demo.mp4
# Press Ctrl+C to stop recording
```

### Android Emulator

```bash
adb shell screenrecord /sdcard/app-demo.mp4
# Press Ctrl+C to stop recording
# Pull file: adb pull /sdcard/app-demo.mp4 ./screenshots/
```

---

## Upload Instructions

1. Record your screen following the app demo flow
2. Save/export as `app-demo.mp4`
3. Place file in this `screenshots/` folder
4. File will automatically display in README.md

**Note:** The README already references this file at `./screenshots/app-demo.mp4`

---

**Status:** 📁 Waiting for upload  
**Last Updated:** November 19, 2025
