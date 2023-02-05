import { User, getUserByAuth } from '../../database/users';
import { Token, signToken } from '../../util/token';
import { Request, Response } from 'express';


function generateAccessToken(userId: string, expiryDate: number, fingerprint: string): Token {
  const signature: string = signToken(userId, expiryDate, fingerprint);
  return { userId, expiryDate, signature };
}

export default async (req: Request, res: Response): Promise<void> => {
  const csrf: string = req.body._csrf;
  const email: string = req.body.email;
  const password: string = req.body.password;
  const rememberMe: boolean = req.body.rememberMe === 'on';

  if (!csrf || !email || !password) {
    const msg: string = 'Invalid details.';
    res.render('pages/sign-in', { msg, csrf: req.csrfToken() });
    return;
  }

  const user: User | null = await getUserByAuth(email, password);

  if (!user) {
    const msg: string = 'No matching user.';
    res.render('pages/sign-in', { msg, csrf: req.csrfToken() });
  }

  else {
    let expiryDate: number = Date.now() + 24 * 60 * 60 * 1000;  // 24 hours
    if (rememberMe) {
      expiryDate *= 7;                                          // 7 days
    }

    const token: Token = generateAccessToken(user.userId, expiryDate, req.fingerprint);
    res.cookie('token', token, { httpOnly: true, secure: true, expires: new Date(expiryDate) });
    res.redirect('/');
  }
}