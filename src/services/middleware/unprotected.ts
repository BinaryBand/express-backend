import { Request, Response, NextFunction } from 'express';


// Sign out authenticated users if they try to access auth pages
export default (_req: Request, res: Response, next: NextFunction): void => {
  res.clearCookie('token');
  next();
};