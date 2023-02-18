import { Request, Response, NextFunction } from 'express';
import { sha256 } from '../../util/crypto';


/**
 * Attempt to return user's IP address.
 * @returns IP address or undefined.
 */
function getIp(req: Request): string {
  return (
    req.header('x-forwarded-for') ||
    req.socket?.remoteAddress ||
    req.ip ||
    'unidentified'
  );
}

/**
 * Create and store a unique hash that identifies our user.
 */
export default (req: Request, _res: Response, next: NextFunction): void => {
  const info: string = [
    req.header('user-agent'),
    req.header('accept-language'),
    getIp(req)
  ].join('/');

  const hash: string = sha256(info);
  req.fingerprint = hash;
  next();
};