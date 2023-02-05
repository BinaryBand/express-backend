import { Request, Response } from 'express';


// Account page
export default async (req: Request, res: Response): Promise<void> => {
  const userId: string = req.cookies.token?.userId;
  res.render('pages/settings', { userId });
};