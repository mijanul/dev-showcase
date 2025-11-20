# Task Manager - Cross-Platform Task Management App

A production-ready task management application built with React Native (Expo), featuring offline-first architecture, Firebase integration, and a modular atomic design structure.

## 🚀 Features

- ✅ **Authentication** - Email/password authentication with Firebase
- ✅ **Task Management** - Full CRUD operations (Create, Read, Update, Delete)
- ✅ **Offline Support** - SQLite local database with automatic sync
- ✅ **Push Notifications** - Local notifications for task reminders
- ✅ **Dark/Light Mode** - Complete theming system with persistence
- ✅ **Redux State Management** - Centralized state with Redux Toolkit
- ✅ **Optimized Performance** - FlatList optimizations for smooth scrolling
- ✅ **Multi-Environment** - Support for dev, staging, and production

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator
- Firebase account (for authentication and Firestore)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd dev-showcase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create your environment files based on the templates:
   - `.env.development`
   - `.env.staging`
   - `.env.production`

   Update the Firebase configuration in each file:
   ```env
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

4. **Initialize Firebase**
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Email/Password authentication
   - Create a Firestore database
   - Download configuration files (see Firebase Setup section below)

## 🏃 Running the App

### Development Mode

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Environment-Specific Builds

```bash
# Development
APP_ENV=development npm start

# Staging
APP_ENV=staging npm start

# Production
APP_ENV=production npm start
```

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Click **Save**

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (or test mode for development)
4. Select a location
5. Click **Enable**

### 4. Set up Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tasks collection
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 5. Download Configuration Files

#### For iOS:
1. In Firebase Console, click the iOS icon
2. Register your app with bundle ID: `com.taskmanager.development`
3. Download `GoogleService-Info.plist`
4. Place it in the project root

#### For Android:
1. In Firebase Console, click the Android icon
2. Register your app with package name: `com.taskmanager.development`
3. Download `google-services.json`
4. Place it in the project root

### 6. Update Environment Variables

Copy your Firebase config values from the Firebase Console:
1. Go to **Project Settings** → **General**
2. Scroll to "Your apps" section
3. Copy the config values to your `.env` files

## 📱 Firebase Cloud Messaging (FCM) Setup

> **Note**: FCM setup requires additional configuration and will be completed in the final phase.

### Steps to Enable FCM:

1. **Enable Cloud Messaging in Firebase Console**
   - Go to **Project Settings** → **Cloud Messaging**
   - Note your **Server Key** and **Sender ID**

2. **Update Notification Service**
   - Open `src/services/notifications/notificationService.ts`
   - Update the `projectId` in `getFCMToken()` method with your Firebase project ID

3. **Configure iOS (if targeting iOS)**
   - Upload APNs authentication key or certificate
   - Enable Push Notifications capability in Xcode

4. **Test Push Notifications**
   - Use Firebase Console → **Cloud Messaging** → **Send test message**
   - Or use the FCM API with your server key

## 📁 Project Structure

```
dev-showcase/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Authentication screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (app)/                    # Main app screens
│   │   ├── tasks.tsx
│   │   └── settings.tsx
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Entry point
├── src/
│   ├── atoms/                    # Basic UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Text/
│   │   └── Checkbox/
│   ├── molecules/                # Composite components
│   │   ├── TaskItem/
│   │   ├── FormField/
│   │   └── EmptyState/
│   ├── organisms/                # Complex components
│   │   ├── TaskList/
│   │   └── AuthForm/
│   ├── store/                    # Redux store
│   │   ├── slices/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── services/                 # Business logic
│   │   ├── auth/
│   │   ├── database/
│   │   ├── firebase/
│   │   ├── sync/
│   │   └── notifications/
│   ├── hooks/                    # Custom React hooks
│   ├── theme/                    # Theme configuration
│   ├── contexts/                 # React contexts
│   └── utils/                    # Utilities
├── .env.development              # Dev environment variables
├── .env.staging                  # Staging environment variables
├── .env.production               # Production environment variables
├── app.config.ts                 # Dynamic app configuration
└── package.json
```

## 🎨 Architecture

### Atomic Design

The app follows **Atomic Design** principles:

- **Atoms**: Basic building blocks (Button, Input, Text, Checkbox)
- **Molecules**: Simple combinations (TaskItem, FormField, EmptyState)
- **Organisms**: Complex components (TaskList, AuthForm)
- **Templates**: Page layouts
- **Pages**: Actual screens

### State Management

- **Redux Toolkit** for global state
- **Slices**: auth, tasks, sync, theme
- **Middleware**: Sync middleware for offline queue
- **Selectors**: Memoized selectors for performance

### Offline-First Architecture

1. **Local Database**: SQLite for persistent storage
2. **Sync Queue**: Operations queued when offline
3. **Automatic Sync**: Syncs when connection restored
4. **Conflict Resolution**: Last-write-wins strategy

## 🔧 Key Technologies

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and SDK
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **Firebase** - Authentication and Firestore
- **SQLite** - Local database
- **Expo Router** - File-based routing
- **React Native Reanimated** - Smooth animations
- **Expo Notifications** - Push notifications

## 📊 Performance Optimizations

### FlatList Optimizations
- `getItemLayout` for consistent item heights
- `removeClippedSubviews` for memory efficiency
- `maxToRenderPerBatch` and `windowSize` tuning
- Memoized render callbacks

### State Management
- Memoized selectors with `createSelector`
- Normalized state structure
- Optimistic updates

### Bundle Size
- Code splitting with Expo Router
- Lazy loading of screens
- Tree shaking

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 🚀 Deployment

### Building for Production

#### iOS
```bash
eas build --platform ios --profile production
```

#### Android
```bash
eas build --platform android --profile production
```

### Environment Configuration

Update `app.config.ts` for production:
- Set correct bundle identifiers
- Configure app icons and splash screens
- Update Firebase project IDs

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `APP_ENV` | Environment (development/staging/production) | Yes |
| `FIREBASE_API_KEY` | Firebase API key | Yes |
| `FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `FIREBASE_APP_ID` | Firebase app ID | Yes |
| `API_BASE_URL` | API base URL (if using custom backend) | No |
| `ENABLE_ANALYTICS` | Enable analytics | No |
| `ENABLE_CRASH_REPORTING` | Enable crash reporting | No |

## 🐛 Troubleshooting

### Common Issues

**1. Firebase initialization error**
- Verify all Firebase environment variables are set correctly
- Check that Firebase project is properly configured
- Ensure `google-services.json` (Android) or `GoogleService-Info.plist` (iOS) are in the correct location

**2. Database not initializing**
- Clear app data and reinstall
- Check SQLite permissions
- Verify database schema migrations

**3. Sync not working**
- Check network connectivity
- Verify Firestore security rules
- Check sync queue in database

**4. Notifications not showing**
- Request notification permissions
- Check notification channel configuration (Android)
- Verify APNs setup (iOS)

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using React Native and Expo**
