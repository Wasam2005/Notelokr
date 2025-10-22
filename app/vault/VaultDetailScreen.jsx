import { useEffect, useState ,useRef} from 'react';
import {
  View,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  Text,
  TouchableOpacity,
  AppState, 
  InteractionManager ,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { loadNotes, updateNote, deleteNote } from '../../util/NoteStorageHelper';
import { decryptNoteFields } from '../../util/NoteEncryptor';
import { useConfirmUnsavedChanges } from '../../util/useConfirmUnsavedChanges';
import AppModal from '../../components/AppModal';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default function VaultDetailScreen() {
  const { noteId } = useLocalSearchParams();
  const router = useRouter();

  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [original, setOriginal] = useState({ title: '', content: '' });
  const [lastUpdated, setLastUpdated] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
const showDeleteModal = () => setDeleteModalVisible(true);
const hideDeleteModal = () => setDeleteModalVisible(false);

const titleRef = useRef(null);
const contentRef = useRef(null);
const keyboardAwareRef = useRef(null);
const [lastFocused, setLastFocused] = useState(null);




useEffect(() => {
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            if (lastFocused === 'title' && titleRef.current) {
              titleRef.current.focus();
              keyboardAwareRef.current?.scrollToFocusedInput(titleRef.current, 120, true);
            } else if (lastFocused === 'content' && contentRef.current) {
              contentRef.current.focus();
              keyboardAwareRef.current?.scrollToFocusedInput(contentRef.current, 120, true);
            }
          }, 150); // ← wait a bit for keyboard layout
        });
      });
    }
  });

  return () => subscription.remove();
}, [lastFocused]);


  const hasUnsavedChanges = title !== original.title || content !== original.content;

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  useConfirmUnsavedChanges(hasUnsavedChanges, showModal);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const allNotes = await loadNotes();
        const targetNote = allNotes.find(n => n.id === noteId);
        if (!targetNote) {
          Alert.alert('Error', 'Note not found');
          router.back();
          return;
        }

        const decrypted = await decryptNoteFields({
          title: targetNote.titleEncrypted,
          content: targetNote.contentEncrypted,
        });

        setNote(targetNote);
        setTitle(decrypted.title);
        setContent(decrypted.content);
        setOriginal({ title: decrypted.title, content: decrypted.content });

        if (targetNote.lastUpdated) {
          const formatted = new Date(targetNote.lastUpdated).toLocaleString();
          setLastUpdated(formatted);
        }
      } catch (err) {
        console.error('Failed to load/decrypt note:', err);
        Alert.alert('Error', 'Failed to load note');
        router.back();
      }
    };

    loadNote();
  }, [noteId]);

  // Clear decrypted state on unmount
useEffect(() => {
  return () => {
    setTitle('');
    setContent('');
    setNote(null);
    setOriginal({ title: '', content: '' });
  };
}, []);


  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Title and content cannot be empty');
      return;
    }


try {
  await updateNote(note.id, { title, content });
  setOriginal({ title, content });
  Toast.show({
    type: 'success',
    text1: 'Saved',
    text2: 'Note updated successfully',
  });
  router.back();
} catch (err) {
  console.error('Save failed:', err);
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: 'Failed to save note',
  });
}
  }
const handleDelete = async () => {
  showDeleteModal();
};


  if (!note) return null;

return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAwareScrollView
     ref={keyboardAwareRef}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={120}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>
            ⚠️ Your notes are securely encrypted and stored locally.
          </Text>
          <Text style={styles.noticeWarning}>
            Uninstalling the app will permanently delete all your notes.
          </Text>
        </View>

        <TextInput
        ref={titleRef}
          style={styles.title}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor="#888"
          onFocus={() => setLastFocused('title')}
        />
        <TextInput

          style={styles.content}
           ref={contentRef}
          value={content}
          onChangeText={setContent}
          multiline
          placeholder="Content"
          placeholderTextColor="#666"
            onFocus={() => setLastFocused('content')}
             onContentSizeChange={() => {
    if (contentRef.current && keyboardAwareRef.current) {
      keyboardAwareRef.current.scrollToFocusedInput(contentRef.current);
    }
  }}
        />

        {lastUpdated ? (
          <Text style={styles.updatedText}>Last updated: {lastUpdated}</Text>
        ) : null}

        {hasUnsavedChanges && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
        <AppModal
  visible={deleteModalVisible}
  title="Confirm Delete"
  message="Are you sure you want to delete this note?"
  buttons={[
    { label: 'Cancel', onPress: hideDeleteModal, style: { backgroundColor: '#2979FF' } },
    {
      label: 'Delete',
      onPress: async () => {
        hideDeleteModal();
        try {
          await deleteNote(note.id);
          Toast.show({
            type: 'error',
            text1: 'Deleted',
            text2: 'Note deleted successfully',
          });
          router.back();
        } catch (err) {
          console.error('Delete failed:', err);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to delete note',
          });
        }
      },
      style: { backgroundColor: '#ff3b30' },
    },
  ]}
  onClose={hideDeleteModal}
/>
<AppModal
  visible={modalVisible}
  title="Unsaved Changes"
  message="You have unsaved changes. What would you like to do?"
  buttons={[
    {
      label: 'Save',
      onPress: async () => {
        hideModal();
        await handleSave();
      },
      style: { backgroundColor: '#2979FF' },
    },
    {
      label: 'Discard',
      onPress: () => {
        hideModal();
        router.back();
      },
      style: { backgroundColor: '#ff3b30' },
    },
  ]}
  onClose={hideModal}
/>

 

      </View>
    </KeyboardAwareScrollView>
  </TouchableWithoutFeedback>
);
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#0a0a0a', // 👈 keep background black inside ScrollView too
  },
  container: {
    
  },
  title: {
    backgroundColor: '#1c1c1e',
    color: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  content: {
    backgroundColor: '#1c1c1e',
    color: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    minHeight: 200, 
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  updatedText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#0a84ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0a84ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  saveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#ff3b30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  deleteText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  noticeContainer: {
    backgroundColor: '#2a2a2c',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#00bfff',
  },
  noticeText: {
    color: '#d1d1d6',
    fontSize: 14,
    lineHeight: 18,
  },
  noticeWarning: {
    color: '#ffcc00',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
});