import { randomId, sha256, encrypt } from '../util/crypto';
import { run, fetch, USERS_TABLE_NAME } from './db';
import { useDatabase } from "./db";
import { Database } from 'sqlite3';


const db: Database = useDatabase();

export type User = {
  userId: string;
  emailHash: string;
  passwordHash: string;
  data: string;
};

export type Data = {
  name: string;
  email: string;
};

function encryptData(name: string, email: string): string {
  const data: Data = { name, email };
  const dataString: string = JSON.stringify(data);
  return encrypt(dataString);
}

export async function addUser(name: string, email: string, password: string): Promise<void> {
  const userId: string = randomId();
  const emailHash: string = sha256(email);
  const passwordHash: string = sha256(password);
  const data: string = encryptData(name, email);

  run(db, `INSERT INTO ${USERS_TABLE_NAME} (userId, emailHash, passwordHash, data)
    VALUES ('${userId}', '${emailHash}', '${passwordHash}', '${data}');`
  );
}

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

export async function userExistsByEmail(email: string): Promise<boolean> {
  const emailHash: string = sha256(email);

  const count: number = await fetch(db, `SELECT * FROM Users
    WHERE emailHash='${emailHash}';`);

  return count !== 0;
}