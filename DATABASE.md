# SQLite Database Integration

## Overview

This project now uses **expo-sqlite** to persist user data locally after successful signup. The database stores user information including email, name, phone number, and encrypted credentials.

## Features

- ✅ User data persisted to SQLite database after signup
- ✅ **Secure password storage with bcrypt hashing and salting**
- ✅ Login validation against database records with password comparison
- ✅ Demo account automatically saved to database with hashed password
- ✅ Database auto-initialization on app start
- ✅ Debug utilities for database inspection (passwords sanitized)

## Database Schema

### Users Table

| Column      | Type    | Constraints               | Description                                   |
| ----------- | ------- | ------------------------- | --------------------------------------------- |
| id          | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique user identifier                        |
| email       | TEXT    | UNIQUE NOT NULL           | User's email address                          |
| firstName   | TEXT    | NOT NULL                  | User's first name                             |
| lastName    | TEXT    | NOT NULL                  | User's last name                              |
| phoneNumber | TEXT    | NULL                      | User's phone number (optional)                |
| password    | TEXT    | NOT NULL                  | User's password (**bcrypt hashed with salt**) |
| createdAt   | INTEGER | NOT NULL                  | Timestamp of account creation                 |
| updatedAt   | INTEGER | NOT NULL                  | Timestamp of last update                      |

## File Structure

```
utils/
├── database.ts       # Core database operations
├── db-debug.ts       # Debugging utilities
├── seed-demo.ts      # Demo account seeding utilities
└── secure-storage.ts # Secure storage for tokens

context/
└── auth-context.tsx  # Authentication with DB integration
```

## Demo Account

The app automatically seeds a demo account on first run:

- **Email**: `hi@mijanul.in`
- **Password**: `Demo@123`

The demo account is stored in the database with a hashed password, just like regular user accounts. You can use the "Login with Demo" button to access it.

### Managing Demo Account

```typescript
import { seedDemoAccount, removeDemoAccount } from "@/utils/seed-demo";

// Manually seed demo account
await seedDemoAccount();

// Remove demo account
await removeDemoAccount();
```

## Usage

### Signup Flow

When a user signs up:

1. User data is validated
2. **Password is hashed using bcrypt with automatic salt generation (10 rounds)**
3. Data is saved to SQLite database with hashed password
4. Secure storage stores authentication token (password is NOT stored)
5. User is logged in automatically

```typescript
await signup(firstName, lastName, email, password, phoneNumber);
```

### Login Flow

When a user logs in:

1. Email is validated
2. Database is queried for matching user by email
3. **Password is verified using bcrypt comparison (secure timing-safe comparison)**
4. Session token is generated and stored in secure storage
5. User is authenticated

```typescript
await login(email, password);
```

### Demo Login Flow

When using "Login with Demo":

1. App checks if demo account exists in database
2. If not found, shows error message prompting user to create demo account
3. If found, authenticates using the stored credentials
4. Session token is generated and user is logged in

**Note**: The demo account is automatically seeded when the app initializes, so it should always be available unless manually deleted.

```typescript
await loginWithDemo();
```

### Database Operations

```typescript
import { database } from "@/utils/database";

// Get user by email
const user = await database.getUserByEmail("user@example.com");

// Update user
await database.updateUser("user@example.com", {
  firstName: "NewName",
  phoneNumber: "+1234567890",
});

// Update password (automatically hashed)
await database.updateUser("user@example.com", {
  password: "newPassword123",
});

// Delete user
await database.deleteUser("user@example.com");

// Get all users
const allUsers = await database.getAllUsers();
```

### Password Utilities

```typescript
import { passwordUtils } from "@/utils/database";

// Hash a password (done automatically in signup/update)
const hashedPassword = await passwordUtils.hashPassword("myPassword123");

// Compare passwords (done automatically in login)
const isValid = await passwordUtils.comparePassword(
  "plainTextPassword",
  hashedPasswordFromDB
);
```

### Debug Utilities

```typescript
import { dbDebug } from "@/utils/db-debug";

// View all users (passwords shown as [HASHED])
await dbDebug.getAllUsers();

// View specific user (password shown as [HASHED])
await dbDebug.getUser("user@example.com");

// Delete specific user
await dbDebug.deleteUser("user@example.com");

// Clear all users
await dbDebug.clearAllUsers();
```

## Security Notes

✅ **Production-Ready Security Features:**

- **Bcrypt password hashing** with automatic salt generation (10 rounds)
- **Timing-safe password comparison** to prevent timing attacks
- Passwords are **never stored in plain text** anywhere in the system
- Passwords are **never logged** or displayed in debug utilities
- Secure token storage using Expo SecureStore
- Password updates automatically hash new passwords before storage

⚠️ **Additional Recommendations for Production:**

- Implement proper JWT authentication tokens
- Add encryption for sensitive data at rest
- Use HTTPS for all API communications
- Implement rate limiting for login attempts
- Add two-factor authentication (2FA)
- Regular security audits and dependency updates
- Use environment variables for sensitive configurations

## Testing

To test the database integration:

1. **Sign up a new user**

   - Navigate to signup screen
   - Fill in the form
   - Check console logs for database confirmation

2. **Verify data persistence**

   ```typescript
   import { dbDebug } from "@/utils/db-debug";
   await dbDebug.getAllUsers(); // Check console
   ```

3. **Test login**
   - Logout
   - Login with the same credentials
   - Verify authentication works

## Database Location

The SQLite database file is stored at:

- **iOS**: `Library/Application Support/devshowcase.db`
- **Android**: Internal app storage

## Migration Notes

If you need to update the database schema:

1. Update the `createTables()` method in `utils/database.ts`
2. Add migration logic for existing data
3. Test thoroughly before deployment

## Troubleshooting

### Database not initializing

- Check console for initialization errors
- Ensure `database.init()` is called in AuthProvider

### User not found after signup

- Check if signup completed successfully
- Use debug utilities to inspect database
- Check for errors in console

### Login fails with valid credentials

- Verify database contains the user using debug utilities
- Check if password was hashed correctly during signup
- Ensure bcryptjs is installed correctly
- Review login logic in auth-context.tsx
- Check console for bcrypt comparison errors

### Password hashing errors

- Ensure bcryptjs package is installed: `npm install bcryptjs`
- Verify TypeScript types are installed: `npm install --save-dev @types/bcryptjs`
- Check that passwordUtils is imported correctly
- Review console for specific error messages

## Future Enhancements

- [x] Password hashing with bcrypt ✅
- [ ] JWT token authentication
- [ ] Two-factor authentication (2FA)
- [ ] Password strength requirements
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Account recovery options
- [ ] Database migrations system
- [ ] User profile updates
- [ ] Account deletion flow
- [ ] Data export functionality
- [ ] Multi-user support
- [ ] Offline sync capabilities
