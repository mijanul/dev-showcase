# Dev Showcase - Production-Grade React Native App

A comprehensive mobile application demonstrating enterprise-level architecture, secure authentication, and modern UI/UX patterns built with React Native and Expo.

## 📱 Demo

### Download Test APK

**Android Test Build:** [app-release.apk](./android/app/build/outputs/apk/release/app-release.apk)

### Screen Recording

![App Demo](./screenshots/app-demo.mp4)

> _Note: Screen recording will be added soon_

## ✨ Key Features

- 🏗️ **Atomic Design Architecture** - Scalable component hierarchy (atoms → molecules → organisms)
- 🔐 **Secure Authentication** - Multi-factor authentication with biometric support
- 💾 **SQLite Database** - Offline-first data persistence with expo-sqlite
- 👆 **Biometric Login** - Face ID, Touch ID, and fingerprint authentication
- 🔒 **Password Hashing** - bcrypt encryption for secure credential storage
- 📝 **Form Validation** - Real-time validation with react-hook-form
- 🔄 **Session Management** - Persistent sessions with auto-login
- 🌓 **Dark Mode** - System-aware theme with manual toggle
- 🎨 **Context-Based State** - Centralized theme and auth management
- ✅ **Unit Testing** - Jest with React Native Testing Library (86%+ coverage)
- 🎭 **Demo Mode** - Quick exploration with pre-populated test account
- 🚨 **Account Lockout** - Brute-force protection after failed login attempts

## 🛠️ Technology Stack

### Core Packages

| Package                   | Purpose                               |
| ------------------------- | ------------------------------------- |
| **expo** (~54.0.24)       | Development platform and build system |
| **expo-router** (~6.0.15) | File-based navigation and routing     |
| **react-native** (0.81.5) | Cross-platform mobile framework       |
| **typescript** (~5.9.2)   | Type safety and developer experience  |

### Authentication & Security

| Package                                 | Purpose                                                   |
| --------------------------------------- | --------------------------------------------------------- |
| **expo-secure-store** (^15.0.7)         | Encrypted credential storage (Keychain/Keystore)          |
| **expo-local-authentication** (~17.0.7) | Biometric authentication (Face ID, Touch ID, Fingerprint) |
| **bcryptjs** (^3.0.3)                   | Password hashing and verification                         |
| **expo-crypto** (~15.0.7)               | Cryptographic operations and secure random generation     |

### Data & Forms

| Package                       | Purpose                                   |
| ----------------------------- | ----------------------------------------- |
| **expo-sqlite** (~16.0.9)     | Local database for user data and sessions |
| **react-hook-form** (^7.66.1) | Form state management and validation      |

### UI & UX

| Package                                 | Purpose                                |
| --------------------------------------- | -------------------------------------- |
| **@expo/vector-icons** (^15.0.3)        | Icon library (Ionicons, MaterialIcons) |
| **react-native-toast-message** (^2.3.3) | Toast notifications for user feedback  |
| **react-native-reanimated** (~4.1.1)    | Smooth animations and gestures         |
| **expo-haptics** (~15.0.7)              | Tactile feedback on interactions       |

### Navigation

| Package                                    | Purpose                        |
| ------------------------------------------ | ------------------------------ |
| **@react-navigation/native** (^7.1.8)      | Navigation container and state |
| **@react-navigation/bottom-tabs** (^7.4.0) | Tab-based navigation UI        |

### Testing

| Package                                     | Purpose                           |
| ------------------------------------------- | --------------------------------- |
| **jest** (^30.2.0)                          | Test runner and assertion library |
| **@testing-library/react-native** (^13.3.3) | Component testing utilities       |
| **jest-expo** (^54.0.13)                    | Expo-specific Jest configuration  |

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode 15+ (macOS only)
- For Android: Android Studio with SDK 34+

### Installation

```bash
# Clone the repository
git clone https://github.com/mijanul/dev-showcase.git
cd dev-showcase

# Install dependencies
npm install

# Start development server
npm start
```

### Running the App

```bash
# Development server (choose platform from menu)
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

### Available Scripts

| Script                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm start`             | Start Expo development server            |
| `npm run android`       | Build and run on Android emulator/device |
| `npm run ios`           | Build and run on iOS simulator/device    |
| `npm run web`           | Start web development server             |
| `npm test`              | Run Jest test suite                      |
| `npm run test:watch`    | Run tests in watch mode                  |
| `npm run test:coverage` | Generate coverage report                 |
| `npm run lint`          | Run ESLint for code quality              |

## 🏗️ Architecture

### Design Pattern

This project follows **Atomic Design** principles for component organization:

- **Atoms**: Basic UI elements (Button, Input, Text, Card)
- **Molecules**: Composite components (FormInput, PasswordInput, Checkbox)
- **Organisms**: Complex features (LoginForm, SignupForm, AuthHeader)

### State Management

- **Context API** for global state (auth, theme)
- **React Hook Form** for local form state
- **SQLite** for persistent data storage

### Security Architecture

#### Password Security

- **bcrypt hashing** with salt rounds for password storage
- **Never stored in plain text** - even in secure storage
- **Hash verification** on login without exposing raw passwords

#### Session Management

- **Secure tokens** stored in platform-native encrypted storage
- **Auto-login** on app launch for authenticated users
- **Account lockout** after 5 failed login attempts (5-minute cooldown)

#### Biometric Authentication

- **Platform-native APIs** (Face ID on iOS, Fingerprint on Android)
- **Credential caching** only after successful password login
- **Fallback to password** if biometric fails or is unavailable

## 📊 Validation Rules

### Email Validation

- RFC-compliant email regex
- Case-insensitive matching
- Real-time error feedback

### Password Requirements

- **Minimum 8 characters**
- **At least one uppercase letter** (A-Z)
- **At least one lowercase letter** (a-z)
- **At least one number** (0-9)
- **At least one special character** (!@#$%^&\*()\_+)
- **Real-time strength indicator** (Weak → Medium → Strong)

### Phone Number Validation

- **International format support** with country codes
- **Format validation** based on selected country
- **Length validation** (10-15 digits typical)

### Additional Rules

- **Name**: 2-50 characters, letters and spaces only
- **Passwords must match** on signup
- **Terms acceptance** required for registration

## 🔒 Security Approach

### Implemented Security Measures

1. **Encrypted Storage**

   - iOS: Keychain with hardware-backed encryption
   - Android: EncryptedSharedPreferences with Keystore
   - Web: Fallback to localStorage (dev only)

2. **Password Hashing**

   - bcrypt with salt rounds (cost factor: 10)
   - One-way hashing prevents credential recovery
   - Secure comparison using timing-safe equals

3. **Brute-Force Protection**

   - 5 failed attempts trigger 5-minute lockout
   - Attempt counter persists across app restarts
   - Visual countdown timer during lockout

4. **Session Security**

   - Session tokens auto-expire after inactivity
   - Logout clears all stored credentials
   - No sensitive data in AsyncStorage

5. **Biometric Security**
   - Hardware-level authentication on supported devices
   - Credentials only cached after password verification
   - Automatic fallback to password on biometric failure

### Trade-offs & Decisions

#### ✅ Chosen Approach: Local SQLite + bcrypt

**Pros:**

- No backend infrastructure required
- Offline-first functionality
- Fast local authentication
- Full data privacy (no cloud storage)

**Cons:**

- No cloud sync across devices
- Database limited to device storage
- Password reset requires app reinstall

#### ❌ Alternative Not Chosen: Firebase Auth

**Why not:**

- Adds external dependency
- Requires internet connectivity
- Introduces third-party data handling
- Overkill for demonstration purposes

#### 📝 Form Validation Trade-off

**Chosen:** Real-time validation with react-hook-form

**Pros:**

- Immediate user feedback
- Reduces submission errors
- Better UX with field-level errors

**Cons:**

- More frequent re-renders
- Slightly higher bundle size

#### 🎨 Styling Trade-off

**Chosen:** StyleSheet API (native)

**Not chosen:** Styled Components, NativeWind

**Reason:**

- Better performance (no runtime overhead)
- Smaller bundle size
- Native-first approach aligns with Expo best practices

## 📚 Documentation

- **[DATABASE.md](./DATABASE.md)** - Database schema and SQLite implementation
- **[AI-TOOLS.md](./AI-TOOLS.md)** - AI assistance transparency and usage details

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Current Coverage:** 86%+ across components and utilities

**Test Strategy:**

- Unit tests for validation functions
- Component tests for UI interactions
- Integration tests for authentication flow

## 🎯 Quick Demo Flow

1. **Launch the app** → Home screen appears
2. **Navigate to Login** → Tap "Go to Login Page"
3. **Demo Account** → Tap "🎭 Explore as Demo User"
   - Email: `demo@example.com`
   - Auto-populated data and showcase features
4. **Signup Flow** → Create account with validation
5. **Biometric Setup** → Enable after first password login
6. **Dark Mode** → Toggle with sun/moon icon
7. **Logout** → Secure credential cleanup

## 📚 Documentation

- **[DATABASE.md](./DATABASE.md)** - Database schema and SQLite implementation
- **[AI-TOOLS.md](./AI-TOOLS.md)** - AI assistance transparency and usage details

## 🏗️ Project Structure

```
components/
├── atoms/          # Basic building blocks (Button, Input, Text, etc.)
├── molecules/      # Compound components (FormInput, FormHeader, Checkbox, etc.)
└── organisms/      # Complex components (LoginForm, SignupForm)

context/
├── auth-context.tsx    # Authentication & secure storage
└── theme-context.tsx   # Theme management

app/
├── auth/
│   ├── login.tsx       # Login page
│   └── signup.tsx      # Signup page
├── account.tsx         # Account management & logout
└── organisms/      # Complex components (LoginForm, SignupForm)

app/
├── auth/
│   ├── login.tsx   # Login page
│   └── signup.tsx  # Signup page
└── showcase.tsx    # Component showcase

context/
└── theme-context.tsx  # Centralized theme management
```

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
