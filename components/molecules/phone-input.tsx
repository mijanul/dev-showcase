import { useTheme } from "@/context/theme-context";
import countries from "@/data/countries.json";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Text } from "../atoms/text";

export interface PhoneInputProps {
  value: string;
  onChangeValue: (value: string) => void;
  countryCode: string;
  onChangeCountryCode: (code: string) => void;
  error?: string;
  onBlur?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeValue,
  countryCode,
  onChangeCountryCode,
  error,
  onBlur,
  accessibilityLabel = "Phone number",
  accessibilityHint = "Enter your phone number",
}) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCountry = countries.find((c) => c.code === countryCode);

  const filteredCountries = searchQuery
    ? countries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.dialCode.includes(searchQuery)
      )
    : countries;

  const handleCountrySelect = (code: string) => {
    onChangeCountryCode(code);
    setModalVisible(false);
    setSearchQuery("");
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? colors.error : colors.border,
            backgroundColor: colors.cardBackground,
          },
        ]}
      >
        <Pressable
          onPress={() => setModalVisible(true)}
          style={[styles.countrySelector, { borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Select country code"
          accessibilityHint="Opens a list of countries to choose from"
        >
          <Text style={styles.dialCode}>
            {selectedCountry?.dialCode || "+1"}
          </Text>
          <Text style={styles.arrow}>▼</Text>
        </Pressable>

        <TextInput
          value={value}
          onChangeText={onChangeValue}
          onBlur={onBlur}
          placeholder="Phone number"
          placeholderTextColor={colors.text + "80"}
          keyboardType="phone-pad"
          style={[styles.input, { color: colors.text }]}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />
      </View>

      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close country selector"
              >
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search countries..."
              placeholderTextColor={colors.text + "80"}
              style={[
                styles.searchInput,
                {
                  color: colors.text,
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
              accessibilityLabel="Search countries"
            />

            <ScrollView style={styles.countryList}>
              {filteredCountries.map((country) => (
                <Pressable
                  key={country.code}
                  onPress={() => handleCountrySelect(country.code)}
                  style={[
                    styles.countryItem,
                    { borderBottomColor: colors.border },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${country.name}, ${country.dialCode}`}
                >
                  <Text style={styles.countryName}>{country.name}</Text>
                  <Text style={styles.countryCode}>{country.dialCode}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRightWidth: 1,
    minWidth: 80,
  },
  dialCode: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
  arrow: {
    fontSize: 10,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  searchInput: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  countryName: {
    fontSize: 16,
    flex: 1,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 16,
  },
});
