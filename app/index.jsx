import React, { useEffect } from 'react';
import { View, StatusBar, StyleSheet, Platform, SafeAreaView } from 'react-native';
import SplashAnimation from '../screens/SplashAnimation';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-get-random-values';

export default function Index() {
  useEffect(() => {
    SplashScreen.hideAsync(); // hides the native splash screen
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Platform.OS === 'android' ? '#0a0a0a' : 'transparent'}
          translucent={Platform.OS === 'ios'}
        />
        <SplashAnimation />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
