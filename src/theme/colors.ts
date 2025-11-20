// Color palette for light and dark themes

export const colors = {
  light: {
    // Primary colors
    primary: '#6366F1', // Indigo
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    
    // Secondary colors
    secondary: '#10B981', // Green
    secondaryLight: '#34D399',
    secondaryDark: '#059669',
    
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    backgroundTertiary: '#F3F4F6',
    
    // Surface colors
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    
    // Text colors
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    
    // Border colors
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    borderDark: '#D1D5DB',
    
    // Status colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    
    // Task specific
    taskCompleted: '#D1FAE5',
    taskActive: '#DBEAFE',
  },
  dark: {
    // Primary colors
    primary: '#818CF8',
    primaryLight: '#A5B4FC',
    primaryDark: '#6366F1',
    
    // Secondary colors
    secondary: '#34D399',
    secondaryLight: '#6EE7B7',
    secondaryDark: '#10B981',
    
    // Background colors
    background: '#111827',
    backgroundSecondary: '#1F2937',
    backgroundTertiary: '#374151',
    
    // Surface colors
    surface: '#1F2937',
    surfaceElevated: '#374151',
    
    // Text colors
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    textInverse: '#111827',
    
    // Border colors
    border: '#374151',
    borderLight: '#4B5563',
    borderDark: '#1F2937',
    
    // Status colors
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',
    
    // Task specific
    taskCompleted: '#065F46',
    taskActive: '#1E3A8A',
  },
} as const;

export type ColorScheme = typeof colors.light;
export type ThemeMode = 'light' | 'dark';
