import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptNoteFields, isEncrypted } from './NoteEncryptor';

export async function loadNotes() {
  const saved = await AsyncStorage.getItem('vault_notes');
  return saved ? JSON.parse(saved) : [];
}

export async function saveNotes(notes) {
  await AsyncStorage.setItem('vault_notes', JSON.stringify(notes));
}

export async function addNote({ title, content }) {
  try {
    const encrypted = await encryptNoteFields({ title, content });

    if (!isEncrypted(encrypted.title) || !isEncrypted(encrypted.content)) {
      console.error('Encryption failed: Invalid encrypted format');
      throw new Error('Encryption failed validation');
    }

    const notes = await loadNotes();

    const newNote = {
      id: Date.now().toString(),
      titleEncrypted: encrypted.title,
      contentEncrypted: encrypted.content,
      lastUpdated: Date.now(), // 🆕 add timestamp
    };

    await saveNotes([...notes, newNote]);
    return newNote;
  } catch (err) {
    console.error('Add note failed:', err);
    throw err;
  }
}

export async function updateNote(id, { title, content }) {
  try {
    const encrypted = await encryptNoteFields({ title, content });

    if (!isEncrypted(encrypted.title) || !isEncrypted(encrypted.content)) {
      console.error('Encryption failed: Invalid encrypted format');
      throw new Error('Encryption failed validation');
    }

    const notes = await loadNotes();

    const updated = notes.map(n =>
      n.id === id
        ? {
            ...n,
            titleEncrypted: encrypted.title,
            contentEncrypted: encrypted.content,
            lastUpdated: Date.now(), // 🆕 update timestamp
          }
        : n
    );

    await saveNotes(updated);
    return updated;
  } catch (err) {
    console.error('Update note failed:', err);
    throw err;
  }
}

export async function deleteNote(id) {
  const notes = await loadNotes();
  const updated = notes.filter(n => n.id !== id);
  await saveNotes(updated);
  return updated;
}
