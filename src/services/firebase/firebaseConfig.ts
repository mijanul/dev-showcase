// Firebase Configuration

import Constants from "expo-constants";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

// Get config from app.config.ts extra field
const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey || "",
  authDomain: extra.firebaseAuthDomain || "",
  projectId: extra.firebaseProjectId || "",
  storageBucket: extra.firebaseStorageBucket || "",
  messagingSenderId: extra.firebaseMessagingSenderId || "",
  appId: extra.firebaseAppId || "",
};

// Validate configuration
const isConfigValid = Object.values(firebaseConfig).every(
  (value) => value !== ""
);

if (!isConfigValid) {
  console.warn(
    "Firebase configuration is incomplete. Please update your .env file."
  );
}

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);

    // Initialize Auth - Firebase v10+ handles persistence automatically for React Native
    auth = getAuth(app);

    firestore = getFirestore(app);

    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
    console.warn("App will continue without Firebase. Please check your configuration.");
  }
} else {
  console.warn("⚠️ Firebase configuration is incomplete. Firebase services will not be available.");
  console.log("📋 Current config values:", {
    apiKey: extra.firebaseApiKey ? "✓ Set" : "✗ Missing",
    authDomain: extra.firebaseAuthDomain ? "✓ Set" : "✗ Missing",
    projectId: extra.firebaseProjectId ? "✓ Set" : "✗ Missing",
    storageBucket: extra.firebaseStorageBucket ? "✓ Set" : "✗ Missing",
    messagingSenderId: extra.firebaseMessagingSenderId ? "✓ Set" : "✗ Missing",
    appId: extra.firebaseAppId ? "✓ Set" : "✗ Missing",
  });
}

export { app, auth, firestore };
export const isFirebaseConfigured = isConfigValid;
