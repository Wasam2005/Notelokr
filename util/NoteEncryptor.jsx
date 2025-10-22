import CryptoJS from 'crypto-js';
import { getOrCreateEncryptionKey } from './KeyManager';
//using prefix helps while verifying data is encrypted or not
const ENCRYPTION_PREFIX = 'ENC::'; 
//it encrypts data
export async function encryptNoteFields(note) {


  const rawKey = await getOrCreateEncryptionKey();
  

  const key = rawKey; 

  if (!note || typeof note.title !== 'string' || typeof note.content !== 'string') {
    throw new Error('Invalid note data: title and content must be strings');
  }

  const encryptedTitle = ENCRYPTION_PREFIX + CryptoJS.AES.encrypt(note.title, key).toString();
  const encryptedContent = ENCRYPTION_PREFIX + CryptoJS.AES.encrypt(note.content, key).toString();

  return {
    title: encryptedTitle,
    content: encryptedContent,
  };
}

// it verify data is encrypted or not
export function isEncrypted(value) {
  return (
    typeof value === 'string' &&
    value.startsWith(ENCRYPTION_PREFIX) &&
    value.length > 35
  );
}

// it decrypt data
export async function decryptNoteFields(encryptedNote) {
  const key = await getOrCreateEncryptionKey();

  const decryptField = (value) => {
    if (typeof value !== 'string' || !value.startsWith(ENCRYPTION_PREFIX)) {
      throw new Error('Invalid encrypted format');
    }

    const rawEncrypted = value.slice(ENCRYPTION_PREFIX.length);
    const bytes = CryptoJS.AES.decrypt(rawEncrypted, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error('Decryption failed: possibly wrong key or corrupt data');
    }

    return decrypted;
  };

  const result = {};
  if ('title' in encryptedNote) {
    result.title = decryptField(encryptedNote.title);
  }
  if ('content' in encryptedNote) {
    result.content = decryptField(encryptedNote.content);
  }

  return result;
}
