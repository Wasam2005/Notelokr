import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const logoImage = require('../../assets/images/icon.png');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={logoImage} style={styles.image} />
      <Text style={styles.logo}>NoteLokr</Text>
      <Text style={styles.title}>Secure Your Private Details</Text>

      <Text style={styles.info}>• 100% Offline & Encrypted</Text>
      <Text style={styles.info}>• No Login Required</Text>
      <Text style={styles.info}>• No Ads or Trackers</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/onboarding/PinSetupScreen')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
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
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  info: {
    fontSize: 16,
    color: '#888',
    marginVertical: 4,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#0a84ff',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    shadowColor: '#0a84ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
