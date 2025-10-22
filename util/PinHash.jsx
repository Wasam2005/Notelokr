import * as SecureStore from 'expo-secure-store';
import SHA256 from 'crypto-js/sha256';

const PIN_KEY = 'hashed_pin';

// Hash a given PIN
export const hashPin = (pin) => SHA256(pin).toString();

// Save hashed PIN securely
export const saveHashedPin = async (pin) => {
  const hashed = hashPin(pin);
  await SecureStore.setItemAsync(PIN_KEY, hashed);
};

// Validate user input against stored hash
export const validatePin = async (inputPin) => {
  const storedHash = await SecureStore.getItemAsync(PIN_KEY);
  const inputHash = hashPin(inputPin);
  return storedHash === inputHash;
};

// Check if PIN already exists
export const hasPin = async () => {
  const storedHash = await SecureStore.getItemAsync(PIN_KEY);
  return storedHash !== null;
};
