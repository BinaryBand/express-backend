import { Request, Response } from 'express';


// Home page
export default async (req: Request, res: Response): Promise<void> => {
  const userId: string = req.cookies.token?.userId;
  res.render('pages/home', { userId });
};