import { Platform, Alert as RNAlert } from "react-native";

interface AlertButton {
  text?: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

/**
 * Cross-platform alert utility that works on both web and mobile
 */
export const Alert = {
  alert: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: { cancelable?: boolean }
  ) => {
    if (Platform.OS === "web") {
      // Web implementation using native browser dialogs
      if (!buttons || buttons.length === 0) {
        // Simple alert
        window.alert(`${title}\n\n${message || ""}`);
        return;
      }

      if (buttons.length === 1) {
        // Single button alert
        window.alert(`${title}\n\n${message || ""}`);
        buttons[0].onPress?.();
        return;
      }

      // Multiple buttons - use confirm dialog
      const confirmed = window.confirm(`${title}\n\n${message || ""}`);

      if (confirmed) {
        // Find the non-cancel button (typically the confirm/destructive action)
        const confirmButton =
          buttons.find((b) => b.style !== "cancel") ||
          buttons[buttons.length - 1];
        confirmButton.onPress?.();
      } else {
        // Find the cancel button
        const cancelButton =
          buttons.find((b) => b.style === "cancel") || buttons[0];
        cancelButton.onPress?.();
      }
    } else {
      // Native mobile implementation
      RNAlert.alert(title, message, buttons, options);
    }
  },
};
