import  { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { loadNotes } from '../../util/NoteStorageHelper';
import { decryptNoteFields } from '../../util/NoteEncryptor';
import SearchBar from '../../components/SearchBar';

export default function VaultListScreen() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const loadAndDecryptTitles = async () => {
    try {
      const saved = await loadNotes();
      const decryptedNotes = await Promise.all(
        saved.map(async (note) => {
          try {
            const { title } = await decryptNoteFields({
              title: note.titleEncrypted,
            });
            return {
              id: note.id,
              title,
              lastUpdated: note.lastUpdated,
            };
          } catch (err) {
            console.warn('Decryption failed for note ID', note.id, err);
            return null;
          }
        })
      );
      setNotes(decryptedNotes.filter((n) => n !== null));
    } catch (error) {
      console.error('Failed to load notes:', error);
      Alert.alert('Load Error', 'Failed to load notes.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAndDecryptTitles();
    }, [])
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderItem = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <TouchableOpacity
        style={styles.noteItem}
        onPress={() =>
          router.push({
            pathname: '/vault/VaultDetailScreen',
            params: { noteId: item.id },
          })
        }
      >
        <Text style={styles.noteTitle}>{item.title}</Text>
        {item.lastUpdated && (
          <Text style={styles.noteDate}>
            Last updated: {formatDate(item.lastUpdated)}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 🔝 App Icon + Name (Left) & Settings Icon (Right) */}
      <View style={styles.topRow}>
        <View style={styles.appLeft}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.appIcon}
          />
          <Text style={styles.appName}>NoteLokr</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/vault/Settings')}
          style={styles.settingsIcon}
        >
          <Feather name="settings" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 🔍 Search Bar */}
      <View style={styles.searchWrapper}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </View>

      <FlatList
        data={filteredNotes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes found. Add a new one!</Text>
        }
         showsVerticalScrollIndicator={false}
      />

      {/* ➕ Add Note Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/vault/AddNewVault')}
      >
        <Text style={styles.addButtonText}>+ Add Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  appLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    borderRadius: 5,
    marginRight: 8,
  },
  appName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  settingsIcon: {
    padding: 6,
  },
  searchWrapper: {
    marginBottom: 10,
  },
  noteItem: {
    padding: 15,
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  noteDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#0a84ff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
    shadowColor: '#0a84ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
