# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## ✨ Features

This project showcases:

- 🏗️ **Atomic Design Architecture** - Modular component structure (atoms, molecules, organisms)
- 🔐 **Secure Authentication** - Expo SecureStore (Keychain/Keystore) for credential storage
- 📝 **Login/Signup Forms** - Complete authentication UI with validation
- ✅ **Form Validation** - Powered by react-hook-form
- 🔄 **Session Persistence** - Auto-login across app restarts with "Remember Me"
- 🚪 **Secure Logout** - Complete credential cleanup on logout
- 🌓 **Dark Mode** - Theme toggle with persistent storage
- 🎨 **Centralized Theming** - Context API for theme management
- 📱 **Responsive Design** - Mobile-first approach

## 🔒 Security

This app implements **production-grade security** for credential storage:

- ✅ **No plaintext storage** - All credentials encrypted via platform-native APIs
- ✅ **Keychain (iOS)** - Hardware-backed secure storage
- ✅ **Keystore (Android)** - Tamper-resistant credential storage
- ✅ **Session management** - Persistent sessions with secure tokens
- ✅ **Clean logout** - All data removed from secure storage

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## 🎯 Quick Demo

1. Launch the app
2. Tap **"Go to Login Page"** on the home screen (or signup if no account)
3. Login/Signup and check the "Remember Me" option
4. Close and reopen the app - you'll be automatically logged in!
5. View your account details in the Account screen
6. Toggle dark mode with the sun/moon icon
7. Logout to clear all secure credentials

## 📚 Documentation

- **[SECURITY_DOCUMENTATION.md](./SECURITY_DOCUMENTATION.md)** - ⭐ Secure storage implementation and best practices
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete feature overview and implementation details
- **[AUTH_DOCUMENTATION.md](./AUTH_DOCUMENTATION.md)** - Authentication system guide and API reference
- **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - Visual component hierarchy and data flow
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference guide for developers

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
