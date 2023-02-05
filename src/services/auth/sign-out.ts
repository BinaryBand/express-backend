import { Request, Response } from 'express';


export default (_req: Request, res: Response): void => {
  res.clearCookie('token');
  res.redirect('/sign-in');
}