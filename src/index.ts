import express, { Express, Request, Response } from 'express';
import { config } from 'dotenv';
config();

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import csrf from 'csurf';
import path from 'path';
import hbs from 'hbs';


declare global {
  namespace Express {
    interface Request {
      csrf: string;
      fingerprint: string;
      message: string;
    }
  }
}

const port: number = 3000;
const app: Express = express();

// Hide ExpressJs identifier to provide an extra layer of obsecurity
app.disable('x-powered-by');

// Parse incoming request bodies under the req.cookies property
app.use(cookieParser());

// Parse incoming request bodies under the req.body property
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Protect from some well-known web vulnerabilities by setting HTTP headers appropriately
app.use(helmet());

// Protect against cross-site request forgery
app.use(csrf({ cookie: true }));

// Allow items in 'public' folder to be accessible from any webpage
app.use(express.static('public'));

// Configure Handlebars view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.set('view options', { layout: 'templates/main' });
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Identify users' unique devices
import fingerprint from './services/middleware/fingerprint';
app.use(fingerprint);

// Delete user token if its invalid or expired
import authenticate from './services/middleware/authenticate';
app.use(authenticate);

// Sign out authenticated users if they try to access 'sign in' or 'sign up' pages
import unprotected from './services/middleware/unprotected';

import homePage from './pages/home';
import signInPage from './pages/sign-in';
import signUpPage from './pages/sign-up';
import settingsPage from './pages/settings';

app.get('/', homePage);                         // Home page
app.get('/sign-in', unprotected, signInPage);   // Sign in page
app.get('/sign-up', unprotected, signUpPage);   // Sign up page
app.get('/settings', settingsPage);             // Account page

import signIn from './services/auth/sign-in';
import signUp from './services/auth/sign-up';
import signOut from './services/auth/sign-out';

// Setup database functions
app.post('/sign-in', signIn);
app.post('/sign-up', signUp, signIn);
app.get('/sign-out', signOut);

app.post('/change-account-details', (req: Request, res: Response): void => {
  const csrf: string = req.body._csrf;
  const password: string = req.body.password;
  const newPassword: string = req.body.new_password;

  console.log(csrf, password, newPassword);

  res.redirect('/');
});

app.post('/delete-account', (req: Request, res: Response): void => {
  const csrf: string = req.body._csrf;
  const password: string = req.body.password;
  const newPassword: string = req.body.new_password;

  console.log(csrf, password, newPassword);

  res.redirect('/sign-in');
});

// Start server
app.listen(port, (): void => {
  console.log(`Now listening on http://localhost:${port}`);
});