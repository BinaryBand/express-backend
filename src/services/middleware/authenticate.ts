import { Request, Response, NextFunction } from 'express';
import { Token, signToken } from '../../util/token';


function validateAccessToken(token: Token, fingerprint: string): boolean {
  if (token.expiryDate < Date.now()) {
    return false;
  }

  const signature: string = signToken(token.userId, token.expiryDate, fingerprint);
  return signature === token.signature;
}

export default (req: Request, res: Response, next: NextFunction): void => {
  const token: Token | undefined = req.cookies.token;

  if (token && !validateAccessToken(token, req.fingerprint)) {
    res.clearCookie('token');
    req.cookies.token = undefined;
  }

  next();
};