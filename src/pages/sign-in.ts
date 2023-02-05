import { Request, Response } from 'express';


// Sign in page
export default (req: Request, res: Response): void => {
  res.render('pages/sign-in', { csrf: req.csrfToken() });
}