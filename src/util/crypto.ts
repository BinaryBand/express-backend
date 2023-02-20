/**
 * Provides utilities for encrypting and decrypting strings.
 * Uses values from environment variables for encryption and hashing.
 */

import crypto, { Cipher, Decipher } from 'crypto';

// the salt used for hashing passwords.
const HASH_SALT: string = process.env.HASH_SALT!;

// the encryption key used to encrypt/decrypt data.
const ENCRYPTION_KEY: Buffer = Buffer.from(process.env.ENCRYPTION_KEY!, 'base64');

/**
 * Generates a random base-64 string of the given number of bytes.
 * @param numBytes - The number of bytes to include in the generated string.
 * @returns A Promise that resolves to a random base-64 string of the specified length.
 */
export function randomId(numBytes: number = 20): string {
  const bytes: Buffer = crypto.randomBytes(numBytes);
  return bytes.toString('base64');
}

/**
 * Computes a base-64 SHA-256 hash of the given message string.
 * @param msg - The message to hash.
 * @returns A Promise that resolves to a base-64-encoded string representing the SHA-256 hash
 */
export function sha256(msg: string): string {
  return crypto.createHmac('sha256', HASH_SALT).update(msg).digest().toString('base64'); 
}

/**
 * Computes a HMAC-SHA-256 hash of the given message using the provided key.
 * @param key - The secret key to use for the HMAC computation.
 * @param msg - The message to hash.
 * @returns A base-64-encoded string representing the HMAC-SHA-256 hash of the message.
 */
export function hmac256(key: string, msg: string): string {
  return crypto.createHmac('sha256', key).update(msg).digest().toString('base64'); 
}

/**
 * Encrypts the given message string using AES-256-CBC encryption with a randomly generated initialization vector (IV).
 * @param msg - The message to encrypt.
 * @returns A base-64-encoded string representing the encrypted message.
 */
export function encrypt(msg: string): string {
  // Generate a random initialization vector (IV)
  const iv: Buffer = crypto.randomBytes(16);

  // Create a cipher using the encryption key and the IV
  const cipher: Cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

  // Encrypt the message using the cipher and the IV, and concatenate the results into a single buffer
  const encrypted: Buffer = Buffer.concat([iv, cipher.update(msg), cipher.final()]);

  // Convert the encrypted buffer to a base-64-encoded string and return it
  return encrypted.toString('base64');
}

/**
 * Decrypts the given base-64-encoded string using AES-256-CBC encryption with a previously generated initialization vector (IV).
 * @param encrypted - The encrypted message to decrypt.
 * @returns The decrypted message as a UTF-8-encoded string.
 */
export function decrypt(encrypted: string): string {
  // Convert the encrypted message to a buffer
  const buffer: Buffer = Buffer.from(encrypted, 'base64');

  // Extract the initialization vector (IV) and the encrypted message from the buffer
  const iv: Buffer = buffer.subarray(0, 16);
  const msg: Buffer = buffer.subarray(16);

  // Create a decipher using the encryption key and the IV
  const decipher: Decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

  // Decrypt the message using the decipher and the IV, and concatenate the results into a single buffer
  const decrypted: Buffer = Buffer.concat([decipher.update(msg), decipher.final()]);

  // Convert the decrypted buffer to a UTF-8-encoded string and return it
  return decrypted.toString('utf8');
}