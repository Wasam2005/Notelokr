import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import Toast from 'react-native-toast-message';
export default function Layout() {
  useEffect(() => {
    // Set nav bar color to black
    NavigationBar.setBackgroundColorAsync('#0a0a0a');
    NavigationBar.setButtonStyleAsync('light'); // for white icons
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});
