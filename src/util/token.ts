import { hmac256 } from './crypto';


// The secret token used to sign the token
const TOKEN_SECRET: string = process.env.TOKEN_SECRET!;

// The interface for the token object
export type Token = {
  userId: string;
  expiryDate: number;
  signature: string;
};

/**
 * Sign a token by generating its HMAC-256 hash.
 *
 * @param {string} userId - The ID of the user for whom the token is being signed.
 * @param {number} expiryDate - The UNIX timestamp of the token's expiry date.
 * @param {string} fingerprint - A string used to uniquely identify the user's device.
 * @returns {string} - The signed token.
 */
export function signToken(userId: string, expiryDate: number, fingerprint: string): string {
  return hmac256(TOKEN_SECRET, `${userId}${expiryDate}${fingerprint}`);
}