import { addUserToDatabase, userExistsByEmail } from '../../database/users';
import { Request, Response, NextFunction } from 'express';


export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const csrf: string = req.body._csrf;
  const name: string = req.body.name;
  const email: string = req.body.email;
  const password: string = req.body.password;

  if (!csrf || !name || !email || !password) {
    const msg: string = 'Invalid details.';
    res.render('pages/sign-up', { msg, csrf: req.csrfToken() });
  }

  else if (await userExistsByEmail(email)) {
    const msg: string = 'E-mail address already exists.';
    res.render('pages/sign-up', { msg, csrf: req.csrfToken() });
  }

  else {
    addUserToDatabase(name, email, password).then(next);
  }
}