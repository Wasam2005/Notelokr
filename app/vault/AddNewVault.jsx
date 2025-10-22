import  { useState , useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Keyboard,
  StyleSheet,
  Alert,

} from 'react-native';
import { useRef } from 'react';
import { useRouter } from 'expo-router';
import { addNote } from '../../util/NoteStorageHelper';
import { useConfirmUnsavedChanges } from '../../util/useConfirmUnsavedChanges';
import ConfirmNavigationModal from '../../components/BackHandlerModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppState, InteractionManager } from 'react-native';

export default function AddNewVault() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
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
          }, 150); 
        });
      });
    }
  });

  return () => subscription.remove();
}, [lastFocused]);

  const hasUnsavedChanges = title.trim() !== '' || content.trim() !== '';

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Content cannot be empty');
      return;
    }

    try {
      await addNote({ title, content });
      setTitle('');
      setContent('');
      router.back();
    } catch (err) {
      console.error('Add note failed:', err);
      Alert.alert('Save Error', 'Could not save note.');
    }
  };

  useConfirmUnsavedChanges(hasUnsavedChanges, showModal);

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
            style={styles.input}
            placeholder="Note Title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
             ref={contentRef}
            style={styles.textArea}
            placeholder="Note Content"
            placeholderTextColor="#888"
            value={content}
            onChangeText={setContent}
            multiline
           onFocus={() => setLastFocused('content')}
             onContentSizeChange={() => {
    if (contentRef.current && keyboardAwareRef.current) {
      keyboardAwareRef.current.scrollToFocusedInput(contentRef.current);
    }
  }}
          />

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Note</Text>
          </TouchableOpacity>

          <ConfirmNavigationModal
            visible={modalVisible}
            onConfirm={handleSave}
            onCancel={hideModal}
            onDiscard={() => {
              hideModal();
              router.back();
            }}
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
    backgroundColor: '#0a0a0a', 
  },
  container: {
   
    
  },
  input: {
    backgroundColor: '#1c1c1e',
    color: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    backgroundColor: '#1c1c1e',
    color: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    height: 300,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#0a84ff',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#0a84ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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


