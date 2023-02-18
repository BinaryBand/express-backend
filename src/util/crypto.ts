import crypto, { Cipher, Decipher } from 'crypto';


const HASH_SALT: string = process.env.HASH_SALT!;
const ENCRYPTION_KEY: Buffer = Buffer.from(process.env.ENCRYPTION_KEY!, 'base64');

export function randomId(numBytes: number = 20): string {
  const bytes: Buffer = crypto.randomBytes(numBytes);
  return bytes.toString('base64');
};

export function sha256(msg: string): string {
  return crypto.createHmac('sha256', HASH_SALT).update(msg).digest().toString('base64'); 
}

export function hmac256(key: string, msg: string): string {
  return crypto.createHmac('sha256', key).update(msg).digest().toString('base64'); 
}

export function encrypt(msg: string): string {
  const iv: Buffer = crypto.randomBytes(16);
  const cipher: Cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  return Buffer.concat([iv,
    cipher.update(msg),
    cipher.final()
  ]).toString('base64');
}

export function decrypt(encrypted: string): string {
  const buffer: Buffer = Buffer.from(encrypted, 'base64');
  const iv: Buffer = buffer.subarray(0, 16);
  const msg: Buffer = buffer.subarray(16);
  const decipher: Decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  return Buffer.concat([
    decipher.update(msg),
    decipher.final()
  ]).toString('utf8');
}