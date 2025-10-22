import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { validatePin } from '../../util/PinHash';
import {
  KEYPAD_LAYOUT,
  renderPinDots,
  renderKeypad,
} from '../../components/PinKeypad';

export default function UnlockScreen() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const handlePress = (value) => {
    if (pin.length < 4) {
      const newPin = pin + value;
      setPin(newPin);
      if (newPin.length === 4) verifyPin(newPin);
    }
  };

  const handleBackspace = () => !loading && setPin((prev) => prev.slice(0, -1));
  const handleClear = () => !loading && setPin('');
  const handleKeyPress = (key) => {
    if (loading) return;
    if (key === 'back') handleBackspace();
    else if (key === 'clear') handleClear();
    else handlePress(key);
  };

  const verifyPin = async (enteredPin) => {
    try {
      setLoading(true);
      const isValid = await validatePin(enteredPin);

      if (isValid) {
        setPin('');
        router.replace('/vault/VaultListScreen');
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setShowError(true);
        setPin('');
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      setShowError(true);
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Enter Your PIN</Text>

      {renderPinDots(pin, styles.dot, styles.dotFilled, styles.dotsContainer)}

      <View style={styles.keypad}>
        {renderKeypad(
          KEYPAD_LAYOUT,
          handleKeyPress,
          loading,
          styles.row,
          (key) =>
            key === 'back' ? [styles.key, styles.keyBack] : styles.key,
          styles.keyText
        )}
      </View>

      {showError && (
        <View style={styles.overlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Incorrect PIN</Text>
            <Text style={styles.alertMessage}>Please try again.</Text>
            <TouchableOpacity
              onPress={() => setShowError(false)}
              style={styles.alertButton}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 30 : 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 28,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555',
    marginHorizontal: 10,
  },
  dotFilled: {
    backgroundColor: '#ffffff',
  },
  keypad: {
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  key: {
    width: 72,
    height: 72,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 36,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  keyBack: {
    backgroundColor: '#2c2c2e',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  keyText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  alertBox: {
    width: '80%',
    backgroundColor: '#1f1f1f',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ff4d4f',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: '#2c2c2e',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  alertButtonText: {
    color: '#00aaff',
    fontSize: 16,
    fontWeight: '600',
  },
});
