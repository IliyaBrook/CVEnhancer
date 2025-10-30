const getEncryptionKey = (): string => {
  const envKey = import.meta.env.VITE_ENCRYPTION_KEY;
  if (envKey && envKey.length >= 32) {
    return envKey;
  }
  
  const storageKey = 'cvenhancer_ek';
  let key = localStorage.getItem(storageKey);
  
  if (!key) {
    key = generateRandomKey();
    localStorage.setItem(storageKey, key);
  }
  
  return key;
};

const generateRandomKey = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const stringToBytes = (str: string): Uint8Array => {
  return new TextEncoder().encode(str);
};

const bytesToString = (bytes: Uint8Array): string => {
  return new TextDecoder().decode(bytes);
};

const hexToBytes = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
};

const bytesToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
};

const xorEncrypt = (data: string, key: string): string => {
  const dataBytes = stringToBytes(data);
  const keyBytes = hexToBytes(key);
  const encrypted = new Uint8Array(dataBytes.length);
  
  for (let i = 0; i < dataBytes.length; i++) {
    encrypted[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  
  return bytesToHex(encrypted);
};

const xorDecrypt = (encryptedHex: string, key: string): string => {
  const encryptedBytes = hexToBytes(encryptedHex);
  const keyBytes = hexToBytes(key);
  const decrypted = new Uint8Array(encryptedBytes.length);
  
  for (let i = 0; i < encryptedBytes.length; i++) {
    decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  
  return bytesToString(decrypted);
};

export const encrypt = (data: string): string => {
  try {
    const key = getEncryptionKey();
    return xorEncrypt(data, key);
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
};

export const decrypt = (encryptedData: string): string => {
  try {
    const key = getEncryptionKey();
    return xorDecrypt(encryptedData, key);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
};