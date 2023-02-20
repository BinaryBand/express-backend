import { randomId, sha256, encrypt } from '../util/crypto';
import { run, fetch, USERS_TABLE_NAME } from './db';
import { db } from './db';


export type User = {
  userId: string;       // A random string of characters assigned upon account creation.
  emailHash: string;    // Hash of user's email address.
  passwordHash: string; // Hash of user's password.
  data: string;         // Encrypted data belonging to this user.
};

export type Data = {
  name: string;
  email: string;
};

/**
 * Stringify user's data and encrypt it.
 * @param name The name associated with this user.
 * @param email The email address associated with this user.
 * @returns Encrypted name and email.
 */
function encryptData(name: string, email: string): string {
  const data: Data = { name, email };
  const dataString: string = JSON.stringify(data);
  return encrypt(dataString);
}

/**
 * Create a new user and add it to our database.
 * @param name The name of the user to add.
 * @param email The email of the user to add.
 * @param password The password of the user to add.
 */
export async function addUserToDatabase(name: string, email: string, password: string): Promise<void> {
  const userId: string = randomId();
  const emailHash: string = sha256(email);
  const passwordHash: string = sha256(password);
  const data: string = encryptData(name, email);

  run(db, `INSERT INTO ${USERS_TABLE_NAME} (userId, emailHash, passwordHash, data)
    VALUES ('${userId}', '${emailHash}', '${passwordHash}', '${data}');`
  );
}

/**
 * Returns the user object for the user with the given email and password.
 * @param email The email of the user to retrieve.
 * @param password The password of the user to retrieve.
 * @returns A Promise that resolves to the user object, or null if the user is not found or the password is incorrect.
 */
export async function getUserByAuth(email: string, password: string): Promise<User | null> {
  const emailHash: string = sha256(email);
  const passwordHash: string = sha256(password);

  const query: string = `SELECT * FROM ${USERS_TABLE_NAME}
    WHERE emailHash='${emailHash}' AND passwordHash='${passwordHash}';`;

  return new Promise(async (resolve: (row: User | null) => void): Promise<void> => {
    // Return the first user that's found.
    const count: number = await fetch(db, query, resolve as any);

    // Return null if no users are found.
    if (count === 0) {
      resolve(null);
    }
  });
}

/**
 * Returns the user object for the user with the given ID.
 * @param userId The ID of the user to retrieve.
 * @returns A Promise that resolves to the user object, or null if the user is not found.
 */
export async function getUserById(userId: string): Promise<User | null> {
  const query: string = `SELECT * FROM ${USERS_TABLE_NAME}
    WHERE userId='${userId}';`;

  return new Promise(async (resolve: (row: User | null) => void): Promise<void> => {
    // Return the first user that's found.
    const count: number = await fetch(db, query, resolve as any);

    // Return null if no users are found.
    if (count === 0) {
      resolve(null);
    }
  });
}

/**
 * Returns a Promise that resolves to true if a user with the given email address exists in the database,
 * or false if they do not.
 * @param email The email of the user to check for.
 * @returns A Promise that resolves to a boolean indicating whether the user exists.
 */
export async function userExistsByEmail(email: string): Promise<boolean> {
  const emailHash: string = sha256(email);

  const count: number = await fetch(db, `SELECT * FROM Users
    WHERE emailHash='${emailHash}';`);

  return count !== 0;
}