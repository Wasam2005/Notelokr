import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'crypto-js';

const EncKeyName = 'encryption_key';

export async function getOrCreateEncryptionKey() {
  let key = await SecureStore.getItemAsync(EncKeyName);

  if (!key) {
    key = Crypto.lib.WordArray.random(32).toString(Crypto.enc.Base64); 
    await SecureStore.setItemAsync(EncKeyName, key);
  }

  return key;
}
