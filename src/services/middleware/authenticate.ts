import { Request, Response, NextFunction } from 'express';
import { Token, signToken } from '../../util/token';


/**
 * Return whether users' login credentials (auth token) is valid.
 * @param token Auth token containing userID, experation date, and signature.
 * @param fingerprint Identify user's device so token cannot be used on another device.
 * @returns If token is valid.
 */
function validateAccessToken(token: Token, fingerprint: string): boolean {
  if (token.expiryDate < Date.now()) {
    return false;
  }

  const signature: string = signToken(token.userId, token.expiryDate, fingerprint);
  return signature === token.signature;
}

/**
 * Revoke user's login credentials if their token is invalid.
 */
export default (req: Request, res: Response, next: NextFunction): void => {
  const token: Token | undefined = req.cookies.token;

  if (token && !validateAccessToken(token, req.fingerprint)) {
    res.clearCookie('token');
    req.cookies.token = undefined;
  }

  next();
};