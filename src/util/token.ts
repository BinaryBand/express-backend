import { hmac256 } from './crypto';


const TOKEN_SECRET: string = process.env.TOKEN_SECRET!;

export type Token = {
  userId: string;
  expiryDate: number;
  signature: string;
};

export function signToken(userId: string, expiryDate: number, fingerprint: string): string {
  return hmac256(TOKEN_SECRET, `${userId}${expiryDate}${fingerprint}`);
}