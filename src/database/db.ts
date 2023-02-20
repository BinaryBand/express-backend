import sqlite3, { Database, RunResult } from 'sqlite3';


const DATABASE_NAME: string = 'data.db';
export const USERS_TABLE_NAME: string = 'Users';

/**
 * Executes a SQL command on the given database object.
 * @param db The database object to execute the command on.
 * @param command The SQL command to execute.
 * @returns A Promise that resolves when the command is executed.
 */
export function run(db: Database, command: string): Promise<RunResult> {
  return new Promise((resolve: (res: RunResult) => void, reject: (err: Error) => void): void => {
    db.run(command, undefined, (res: RunResult, err: Error | null): void => {
      if (err) {
        reject(err);
      }
      else {
        resolve(res);
      }
    });
  });
}

/**
 * Executes a SQL query on the given database object and passes the resulting data to a callback function.
 * @param db The database object to execute the query on.
 * @param query The SQL query to execute.
 * @param callback A function that accepts the resulting data as its parameter.
 * @returns A Promise that resolves with the number of rows returned by the query.
 */
export function fetch(db: Database, query: string, callback?: (row: unknown) => void): Promise<number> {
  return new Promise((resolve: (count: number) => void, reject: (err: Error) => void): void => {
    const iteration = (err: Error | null, row: unknown): void => {
      if (err) {
        reject(err);
      }
      else if (callback) {
        callback(row);
      }
    };

    db.each(query, iteration, (err: Error | null, count: number): void => {
      if (err) {
        reject(err);
      }
      else {
        resolve(count);
      }
    });
  });
}

export const db: Database = new sqlite3.Database(DATABASE_NAME);

// Create 'Users' table if one does not exist.
((): void => {
  run(db, `CREATE TABLE ${USERS_TABLE_NAME} (
    userId        varchar(255)  PRIMARY KEY,
    emailHash     varchar(255)  NOT NULL,
    passwordHash  varchar(255)  NOT NULL,
    data          string        NOT NULL
  );`);
})();