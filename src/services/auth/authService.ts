// Authentication Service

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createUserWithEmailAndPassword,
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
} from 'firebase/auth';
import { STORAGE_KEYS } from '../../utils/constants';
import { User } from '../../utils/types';
import { auth } from '../firebase/firebaseConfig';

class AuthService {
  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string): Promise<User> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const user = this.mapFirebaseUser(userCredential.user);
      await this.saveUserData(user);
      
      return user;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const user = this.mapFirebaseUser(userCredential.user);
      await this.saveUserData(user);
      
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      await this.clearUserData();
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        return this.mapFirebaseUser(currentUser);
      }
      
      // Try to get from storage
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        return JSON.parse(userData);
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = this.mapFirebaseUser(firebaseUser);
        this.saveUserData(user);
        callback(user);
      } else {
        this.clearUserData();
        callback(null);
      }
    });
  }

  /**
   * Map Firebase user to app User type
   */
  private mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    };
  }

  /**
   * Save user data to AsyncStorage
   */
  private async saveUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  }

  /**
   * Clear user data from AsyncStorage
   */
  private async clearUserData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.AUTH_TOKEN,
      ]);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  /**
   * Handle Firebase auth errors
   */
  private handleAuthError(error: any): Error {
    const errorCode = error.code;
    let message = 'An error occurred';

    switch (errorCode) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/operation-not-allowed':
        message = 'Operation not allowed';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/invalid-credential':
        message = 'Invalid credentials';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection';
        break;
      default:
        message = error.message || 'Authentication failed';
    }

    return new Error(message);
  }
}

export const authService = new AuthService();
