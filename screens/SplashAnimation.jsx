import { useEffect } from 'react';
import { View,  StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { StatusBar } from 'react-native';

const logoImage = require('../assets/images/icon.png');

export default function SplashAnimation() {
  const router = useRouter();

  useEffect(() => {
    

    const startFlow = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const hasOpened = await AsyncStorage.getItem('has_opened_app');
        const hashedPin = await SecureStore.getItemAsync('hashed_pin');

      

        if (hasOpened !== 'true' || !hashedPin) {
          await AsyncStorage.setItem('has_opened_app', 'true');
          router.replace('/onboarding/WelcomeScreen');
        } else {
          router.replace('/unlock/UnlockScreen');
        }
      } catch (error) {
        console.error('Error in splash logic:', error);
      }
    };

    startFlow();
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="pulse"
        easing="ease-in-out"
        iterationCount="infinite"
        source={logoImage}
        style={styles.logo}
        resizeMode="contain"
      />
   
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 60,
    paddingBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },

});
