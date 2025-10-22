import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AppModal from '../../components/AppModal';

export default function SettingsScreen() {
  const router = useRouter();
  const [modalContent, setModalContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const handleRateUs = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.yourapp.package').catch(() =>
      Alert.alert('Error', 'Unable to open Play Store')
    );
  };

  const SettingItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Feather name={icon} size={20} color="#00bfff" style={styles.icon} />
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#00bfff" />
        </TouchableOpacity>
        <Text style={styles.header}>Settings</Text>
      </View>

  
      <SettingItem
        icon="lock"
        label="Change Password"
        onPress={() => router.push('/onboarding/PinSetupScreen')}
      />
      <SettingItem icon="info" label="About" onPress={() => openModal('about')} />
      <SettingItem icon="shield" label="Privacy Policy" onPress={() => openModal('privacy')} />
      <SettingItem icon="thumbs-up" label="Rate Us" onPress={() => openModal('rate')} />

      
      <AppModal
        visible={modalVisible}
        title={
          modalContent === 'about'
            ? 'About'
            : modalContent === 'privacy'
            ? 'Privacy Policy'
            : 'Rate Us'
        }
        message={
          modalContent === 'about'
            ? 'This app is designed for secure note storage.'
            : modalContent === 'privacy'
            ? 'We respect your privacy. No data is shared.'
            : 'Tap below to rate us on the Play Store.'
        }
        buttons={
          modalContent === 'rate'
            ? [{ label: 'Rate Now', onPress: handleRateUs, style: { backgroundColor: '#00bfff' } }]
            : []
        }
        onClose={() => setModalVisible(false)}
      />

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#121212',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: {
    marginRight: 10,
    backgroundColor: '#1e1e1e',
    padding: 8,
    borderRadius: 10,
    shadowColor: '#00bfff',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  icon: {
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#f0f0f0',
  },
});
