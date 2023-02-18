import { Request, Response, NextFunction } from 'express';


/**
 * Delete the 'token' cookie to effectively sign the user out.
 */
export default (_req: Request, res: Response, next: NextFunction): void => {
  res.clearCookie('token');
  next();
};