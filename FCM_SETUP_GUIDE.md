# Firebase Cloud Messaging (FCM) Setup Guide

This guide will walk you through setting up Firebase Cloud Messaging for remote push notifications.

## Prerequisites

- Firebase project created
- App running successfully
- Physical device for testing (FCM doesn't work in simulators)

---

## Step 1: Firebase Console Configuration

### 1.1 Enable Cloud Messaging

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Project Settings** (gear icon) → **Cloud Messaging**
4. Note your **Server Key** and **Sender ID**

### 1.2 Register Your App

#### For Android:

1. In Firebase Console, click **Add app** → **Android**
2. Enter package name: `com.taskmanager.development`
3. Download `google-services.json`
4. Place it in your project root directory

#### For iOS:

1. In Firebase Console, click **Add app** → **iOS**
2. Enter bundle ID: `com.taskmanager.development`
3. Download `GoogleService-Info.plist`
4. Place it in your project root directory

---

## Step 2: Configure APNs (iOS Only)

### 2.1 Create APNs Key

1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Keys** → **+** (Create a new key)
4. Name it "FCM Push Notifications"
5. Enable **Apple Push Notifications service (APNs)**
6. Click **Continue** → **Register**
7. Download the `.p8` key file
8. Note the **Key ID** and **Team ID**

### 2.2 Upload APNs Key to Firebase

1. In Firebase Console, go to **Project Settings** → **Cloud Messaging**
2. Scroll to **iOS app configuration**
3. Click **Upload** under APNs Authentication Key
4. Upload your `.p8` file
5. Enter your **Key ID** and **Team ID**
6. Click **Upload**

---

## Step 3: Update App Configuration

### 3.1 Update app.config.ts

The configuration is already set up! Just verify it includes:

```typescript
plugins: [
  // ... other plugins
  [
    'expo-notifications',
    {
      icon: './assets/images/notification-icon.png',
      color: '#ffffff',
      sounds: ['./assets/sounds/notification.wav'],
    },
  ],
],
```

### 3.2 Update Notification Service

Open `src/services/notifications/notificationService.ts` and update line 105:

```typescript
const token = await Notifications.getExpoPushTokenAsync({
  projectId: 'your-expo-project-id', // Replace with your Expo project ID
});
```

To find your Expo project ID:
```bash
npx expo whoami
```

---

## Step 4: Build and Test

### 4.1 Build Development Build

FCM requires a development build (not Expo Go):

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android --profile development

# Build for iOS
eas build --platform ios --profile development
```

### 4.2 Install on Device

After build completes:
- **Android**: Download and install APK
- **iOS**: Download and install via TestFlight or direct install

### 4.3 Get FCM Token

1. Open the app on your device
2. Grant notification permissions when prompted
3. The FCM token will be logged to the console
4. You can also retrieve it from AsyncStorage:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './src/utils/constants';

const token = await AsyncStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
console.log('FCM Token:', token);
```

---

## Step 5: Send Test Notification

### Method 1: Firebase Console

1. Go to **Firebase Console** → **Cloud Messaging**
2. Click **Send your first message**
3. Enter notification title and text
4. Click **Send test message**
5. Enter your FCM token
6. Click **Test**

### Method 2: Using cURL

```bash
curl -X POST https://fcm.googleapis.com/fcm/send \
  -H "Authorization: key=YOUR_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_FCM_TOKEN",
    "notification": {
      "title": "Test Notification",
      "body": "This is a test from FCM!",
      "sound": "default"
    },
    "data": {
      "taskId": "123",
      "type": "task_reminder"
    }
  }'
```

### Method 3: Using Postman

1. Create POST request to: `https://fcm.googleapis.com/fcm/send`
2. Add headers:
   - `Authorization: key=YOUR_SERVER_KEY`
   - `Content-Type: application/json`
3. Add body:
```json
{
  "to": "YOUR_FCM_TOKEN",
  "notification": {
    "title": "Task Reminder",
    "body": "Don't forget to complete your task!",
    "sound": "default"
  },
  "data": {
    "taskId": "task-123",
    "type": "task_reminder"
  }
}
```

---

## Step 6: Handle Notifications in App

The notification handling is already implemented! Here's what happens:

### Foreground Notifications
```typescript
// In app/_layout.tsx or a root component
useEffect(() => {
  const subscription = notificationService.addNotificationReceivedListener(
    (notification) => {
      console.log('Notification received:', notification);
      // Show in-app notification or update UI
    }
  );

  return () => subscription.remove();
}, []);
```

### Background/Tapped Notifications
```typescript
useEffect(() => {
  const subscription = notificationService.addNotificationResponseReceivedListener(
    (response) => {
      const { taskId, type } = response.notification.request.content.data;
      
      if (type === 'task_reminder' && taskId) {
        // Navigate to task detail
        router.push(`/(app)/tasks`);
      }
    }
  );

  return () => subscription.remove();
}, []);
```

---

## Step 7: Server Integration (Optional)

If you want to send notifications from your backend:

### 7.1 Save FCM Token to Firestore

```typescript
// When user logs in
const fcmToken = await notificationService.getFCMToken();

if (fcmToken && user) {
  await setDoc(doc(firestore, 'users', user.uid), {
    fcmToken,
    updatedAt: Date.now(),
  }, { merge: true });
}
```

### 7.2 Send from Backend

**Node.js Example:**

```javascript
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendTaskReminder(userId, taskTitle) {
  // Get user's FCM token from Firestore
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .get();
  
  const fcmToken = userDoc.data().fcmToken;

  // Send notification
  await admin.messaging().send({
    token: fcmToken,
    notification: {
      title: 'Task Reminder',
      body: `Don't forget: ${taskTitle}`,
    },
    data: {
      taskId: 'task-123',
      type: 'task_reminder',
    },
  });
}
```

---

## Troubleshooting

### Issue: Token not generated

**Solution:**
- Ensure you're testing on a physical device
- Check notification permissions are granted
- Verify Firebase configuration is correct
- Check console for error messages

### Issue: Notifications not received

**Solution:**
- Verify FCM token is correct
- Check Firebase Server Key is correct
- Ensure device has internet connection
- Check notification permissions
- For iOS, verify APNs is configured correctly

### Issue: Notifications work in foreground but not background

**Solution:**
- Ensure you've built a development build (not using Expo Go)
- Check background notification handler is set up
- Verify notification payload includes both `notification` and `data` fields

### Issue: iOS notifications not working

**Solution:**
- Verify APNs key is uploaded to Firebase
- Check bundle ID matches in Firebase and Xcode
- Ensure push notifications capability is enabled in Xcode
- Test on physical device (not simulator)

---

## Testing Checklist

- [ ] FCM token generated successfully
- [ ] Test notification from Firebase Console works
- [ ] Foreground notifications display correctly
- [ ] Background notifications work
- [ ] Tapping notification navigates to correct screen
- [ ] Notification sound plays
- [ ] Badge count updates
- [ ] iOS notifications work (if applicable)
- [ ] Android notifications work (if applicable)

---

## Additional Resources

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [APNs Configuration Guide](https://firebase.google.com/docs/cloud-messaging/ios/certs)

---

## Summary

Once you complete these steps:

1. ✅ Firebase project configured
2. ✅ APNs key uploaded (iOS)
3. ✅ google-services.json added (Android)
4. ✅ Development build created
5. ✅ FCM token retrieved
6. ✅ Test notification sent successfully

Your app will have full remote push notification support! 🎉

For any issues, refer to the troubleshooting section or check the Firebase Console logs.
