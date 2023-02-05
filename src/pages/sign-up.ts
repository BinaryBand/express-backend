import { Request, Response } from 'express';


// Sign up page
export default (req: Request, res: Response): void => {
  res.render('pages/sign-up', { csrf: req.csrfToken() });
}