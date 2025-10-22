import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { saveHashedPin } from '../../util/PinHash';
import {
  KEYPAD_LAYOUT,
  renderPinDots,
  renderKeypad,
} from '../../components/PinKeypad';

const logoImage = require('../../assets/images/icon.png'); 

export default function PinSetupScreen() {
  const [pin, setPin] = useState('');
  const router = useRouter();

  const handlePress = (value) => {
    if (pin.length < 4) setPin((prev) => prev + value);
  };

  const handleBackspace = () => setPin((prev) => prev.slice(0, -1));
  const handleClear = () => setPin('');
  const handleKeyPress = (key) => {
    if (key === 'back') handleBackspace();
    else if (key === 'clear') handleClear();
    else handlePress(key);
  };

  const savePin = async () => {
    if (pin.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit PIN');
      return;
    }

    try {
      await saveHashedPin(pin);
      setPin('');
      router.replace('/unlock/UnlockScreen');
    } catch (e) {
      Alert.alert('Error', 'Failed to save PIN. Please try again.');
      console.error('SecureStore error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logoImage} style={styles.logo} />
      <Text style={styles.title}>Set Your NoteLokr PIN</Text>

      {renderPinDots(pin, styles.dot, styles.dotFilled, styles.dotsContainer)}

      <View style={styles.keypad}>
        {renderKeypad(
          KEYPAD_LAYOUT,
          handleKeyPress,
          false,
          styles.row,
          (key) =>
            key === 'back'
              ? [styles.key, styles.keyBack]
              : styles.key,
          styles.keyText
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: pin.length === 4 ? '#0a84ff' : '#333' },
        ]}
        onPress={savePin}
        disabled={pin.length !== 4}
      >
        <Text style={styles.buttonText}>Set PIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#888',
    marginHorizontal: 8,
  },
  dotFilled: {
    backgroundColor: '#fff',
  },
  keypad: {
    width: '80%',
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  key: {
    width: 64,
    height: 64,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  keyBack: {
    backgroundColor: '#1c1c1e',
  },
  keyText: {
    fontSize: 26,
    color: '#fff',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
