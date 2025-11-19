# AI Prompts Collection

This document contains all key prompts used during development for reproducibility.

---

## Project Setup Prompts

### Initial Project Architecture

```
Create a React Native app with Expo using:
- TypeScript for type safety
- expo-router for file-based navigation
- Atomic Design component structure (atoms/molecules/organisms)
- Context API for global state management
- Dark mode support with theme persistence
- SQLite for local data storage

Provide:
- Complete folder structure
- Initial configuration files
- Setup commands for development
```

### Package Selection

```
Recommend packages for a production-grade React Native app with:
- Secure authentication (biometric + password)
- Form validation with real-time feedback
- Local database (offline-first)
- Password hashing
- Navigation (tab + stack)
- Testing framework

For each package, explain why it's the best choice.
```

---

## Authentication Prompts

### Core Authentication System

```
Implement production-grade authentication system with:

Requirements:
- Email/password login with validation
- Secure credential storage (no plaintext anywhere)
- Session persistence with auto-login on app restart
- Biometric authentication (Face ID, Touch ID, Fingerprint)
- Account lockout after 5 failed login attempts
- Password hashing with bcrypt
- "Remember Me" functionality
- Secure logout that clears all credentials

Technology:
- expo-secure-store for iOS Keychain/Android Keystore
- expo-local-authentication for biometric
- bcryptjs for password hashing
- Context API for auth state

Provide:
- auth-context.tsx with all methods
- Proper TypeScript interfaces
- Error handling with user-friendly messages
```

### Biometric Authentication

```
Add biometric authentication to existing password-based system:

Features:
- Detect available biometric type (Face ID, Touch ID, Fingerprint)
- Only enable after successful password login
- Store encrypted credentials for biometric reauth
- Fallback to password if biometric fails
- Show appropriate UI based on device capabilities
- Handle cases: no hardware, not enrolled, not available

Use expo-local-authentication.
Integrate with existing auth-context.
```

### Account Lockout System

```
Implement brute-force protection:
- Track failed login attempts
- Lock account after 5 failed attempts
- 5-minute lockout duration
- Visual countdown timer
- Persist lockout across app restarts
- Clear lockout on successful login
- Show remaining attempts before lockout

Include proper state management and UI feedback.
```

---

## UI Component Prompts

### Base Button Component

```
Create a reusable Button component in TypeScript:

Props:
- variant: 'primary' | 'secondary' | 'outline'
- size: 'small' | 'medium' | 'large'
- loading: boolean (show ActivityIndicator)
- disabled: boolean
- onPress: function
- children: React.ReactNode

Features:
- Theme integration (use colors from theme context)
- Haptic feedback on press (expo-haptics)
- Accessibility labels
- TypeScript interface for all props
- Platform-specific styling adjustments

Export as named export with TypeScript types.
```

### Form Input Components

```
Create form input components with react-hook-form integration:

Components needed:
1. FormInput - basic text input with validation
2. PasswordInput - with show/hide toggle
3. PhoneInput - with country code picker
4. FormHeader - title and subtitle for forms

Features:
- Real-time validation error display
- Integration with react-hook-form Controller
- Theme-aware styling
- Accessibility support
- TypeScript interfaces

Use existing Input atom as base component.
```

### Password Strength Indicator

```
Create a password strength indicator component:

Features:
- Visual strength meter (weak/medium/strong)
- Color-coded: red → yellow → green
- List of requirements with checkmarks
- Requirements:
  - Minimum 8 characters
  - Uppercase letter
  - Lowercase letter
  - Number
  - Special character
- Real-time updates as user types
- TypeScript props interface

Integrate with PasswordInput component.
```

---

## Validation Prompts

### Password Validation

```
Create comprehensive password validation utility:

Rules:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*()_+)

Functions needed:
1. validatePassword(password: string): { isValid: boolean; errors: string[] }
2. checkPasswordStrength(password: string): 'weak' | 'medium' | 'strong'
3. getPasswordRequirements(): Requirement[]

Return specific error messages for each unmet requirement.
Export TypeScript types for all functions.
```

### Email Validation

```
Create email validation function:
- RFC-compliant regex pattern
- Case-insensitive matching
- Clear error messages
- TypeScript type definitions

Return: { isValid: boolean; error?: string }
```

### Phone Number Validation

```
Create phone number validation:
- Support international formats
- Country code validation
- Length validation (10-15 digits)
- Format checking based on country
- TypeScript interfaces

Integrate with countries.json data file.
```

---

## Database Prompts

### SQLite Schema Design

```
Design SQLite database schema for user management app:

Tables needed:
1. users
   - id (primary key, auto-increment)
   - email (unique, not null)
   - password_hash (not null)
   - name (not null)
   - phone (nullable)
   - created_at (timestamp)
   - updated_at (timestamp)

2. sessions
   - id (primary key)
   - user_id (foreign key)
   - token (unique)
   - expires_at (timestamp)
   - created_at (timestamp)

3. user_preferences
   - user_id (primary key, foreign key)
   - biometric_enabled (boolean)
   - theme (text)

Provide:
- CREATE TABLE statements
- Indexes for performance
- Migration pattern
- TypeScript interfaces matching schema
```

### Database Utilities

```
Create database utility functions with expo-sqlite:

Functions:
1. initDatabase() - create tables if not exist
2. createUser(userData: UserData) - insert new user
3. getUserByEmail(email: string) - fetch user
4. updateUser(userId: number, updates: Partial<UserData>) - update
5. deleteUser(userId: number) - soft delete

Features:
- Proper error handling
- TypeScript types for all parameters
- Transaction support for data integrity
- Prepared statements to prevent SQL injection

Export all functions with types.
```

### Demo Data Seeding

```
Create seed script for demo data:

Requirements:
- Check if demo user exists
- Create demo user with:
  - Email: demo@example.com
  - Hashed password: Demo123!@#
  - Name: Demo User
  - Phone: +1 (555) 123-4567
- Seed on first app launch only
- Don't overwrite existing data
- Log seeding status

Use bcrypt for password hashing.
Include proper error handling.
```

---

## Testing Prompts

### Jest Configuration

```
Set up Jest testing environment for Expo React Native app:

Requirements:
- Configure jest-expo preset
- Add React Native Testing Library
- Set up coverage thresholds (85% minimum)
- Configure test file patterns
- Add mock setup for:
  - expo-secure-store
  - expo-local-authentication
  - expo-sqlite
  - react-native-toast-message

Provide:
- jest.config.js
- jest.setup.js
- Example test utilities
```

### Validation Tests

```
Write comprehensive Jest tests for password validation utility:

Test cases:
1. Valid passwords pass all requirements
2. Missing uppercase fails with correct message
3. Missing lowercase fails with correct message
4. Missing number fails with correct message
5. Missing special char fails with correct message
6. Less than 8 chars fails
7. Edge cases: empty string, null, undefined
8. Strength calculation:
   - "password" → weak
   - "Password123" → medium
   - "P@ssw0rd123!" → strong

Use describe/it blocks.
Include edge case testing.
```

### Component Tests

```
Write React Native Testing Library tests for LoginForm component:

Test scenarios:
1. Renders all form fields correctly
2. Email validation shows error for invalid email
3. Password validation shows error for weak password
4. Submit button disabled during loading
5. onSubmit called with correct data on valid submission
6. Forgot password link triggers callback
7. Biometric button appears only when enabled
8. Demo login button works correctly

Mock all external dependencies.
Use proper testing library queries.
```

---

## Documentation Prompts

### README Rewrite

```
Rewrite the README.md for a production-grade showcase app:

Include:
- Project title and description
- Key features list (with emojis)
- Technology stack table with package purposes
- Setup and installation instructions
- All npm scripts documentation
- Architecture explanation (Atomic Design)
- Security approach and implementation
- Validation rules implemented
- Trade-offs and design decisions
- Quick demo flow
- Link to test APK: ./android/app/build/outputs/apk/release/app-release.apk
- Screenshots folder with placeholder for app-demo.mp4
- Links to AI-TOOLS.md and other docs

Keep the existing project structure section.
Professional tone, developer-focused.
```

### AI Usage Documentation

```
Create AI-TOOLS.md documenting AI assistance:

Sections:
1. Tool selection (GitHub Copilot vs alternatives)
2. How AI was used (% breakdown by task)
3. Key prompts used (with examples)
4. AI limitations encountered
5. Code ownership breakdown
6. What AI did well vs what needed human expertise
7. Reproduction guide
8. Transparency statement

Be honest about AI contribution.
Highlight human decision-making.
```

---

## Debugging Prompts

### Fix Build Errors

```
Analyze these build errors and provide fixes:
[paste error output]

Context:
- Using Expo SDK 54
- React Native 0.81.5
- TypeScript 5.9.2

Provide step-by-step solution.
```

### Performance Optimization

```
Optimize this component for better performance:
[paste component code]

Focus on:
- Unnecessary re-renders
- Memo usage
- Callback optimization
- List rendering (if applicable)

Explain each optimization.
```

---

## Production Build Prompts

### Build Configuration

```
How to create production builds for:
1. Development build (local testing)
2. Production build for internal testing (APK)
3. Production build for app stores

Provide commands for:
- Android (APK and AAB)
- iOS (Ad Hoc and App Store)

Include EAS Build setup if applicable.
```

### Git Configuration

```
How to:
1. Force push all code to main branch ignoring remote
2. Change all commit author name to "mijanul"
3. Change all commit author email to "mijanul.dev@gmail.com"
4. Set local git config for this project

Provide exact git commands.
Explain risks of force pushing.
```

---

## Usage Instructions

To reproduce this project:

1. Copy prompts in order of sections
2. Start with "Project Setup Prompts"
3. Move through each section sequentially
4. Review and modify AI outputs before implementing
5. Test thoroughly after each major change
6. Apply human expertise for edge cases and optimizations

**Note:** AI responses may vary. Use these prompts as starting points and iterate based on your specific needs.

---

**Document Version:** 1.0  
**Last Updated:** November 19, 2025  
**Tested With:** GitHub Copilot (Claude Sonnet 4.5)
