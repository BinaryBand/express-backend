import { Request, Response, NextFunction } from 'express';
import { sha256 } from '../../util/crypto';


function getIp(req: Request): string {
  return (
    req.header('x-forwarded-for') ||
    req.socket?.remoteAddress ||
    req.ip ||
    'unidentified'
  );
}

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