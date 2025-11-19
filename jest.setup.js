// Set up global Expo import meta registry before any imports
global.__ExpoImportMetaRegistry = {};

// Polyfill structuredClone for Node < 17
if (!global.structuredClone) {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

import "@testing-library/jest-native/extend-expect";

// Mock Expo modules
jest.mock("expo", () => ({
  __ExpoImportMetaRegistry: {},
}));

// Mock expo-secure-store
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/",
  useLocalSearchParams: () => ({}),
}));
