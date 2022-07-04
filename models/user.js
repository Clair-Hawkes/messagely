"use strict";

const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require('../config.js');
const db = require("../db");


/** User of the site. */

class User {

  /** Register new user. Returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {

    const hashedPassword = await bcrypt.hash(
      password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users (username, password,first_name,last_name,phone,join_at,last_login_at)
           VALUES
             ($1, $2,$3,$4,$5,NOW()::timestamp,NOW()::timestamp)
           RETURNING username, password,first_name,last_name,phone`, [username, hashedPassword, first_name, last_name, phone]);
    const user = result.rows[0];

    // return new User(user);
    return user;

  }

  /** Authenticate: is username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT password
         FROM users
         WHERE username = $1`,
      [username]);
    const user = result.rows[0];

    if (user) {
      if (await bcrypt.compare(password, user.password) === true) {
        return true;
      }
    }
    return false;
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const result = await db.query(
      `UPDATE users
         SET last_login_at = NOW()::timestamp
           WHERE username = $1
           RETURNING last_login_at`, [username]);
    const user = result.rows[0];
    console.log(user);

    if (!user) throw new NotFoundError(`No such user: ${username}`);
    // TODO: Needed? return user.last_login_at;
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

  static async all() {
    const result = await db.query(
      "SELECT username, first_name, last_name FROM users"
    );
    return result.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name,phone,join_at,last_login_at
         FROM users
         WHERE username = $1`, [username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No such user: ${username}`);
    return result.rows[0];

  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  // [{msg},{msg},...]
  // [{id:1,first_name:user,...}]

  static async messagesFrom(username) {
    const result = await db.query(
      `SELECT id, username, first_name, last_name, phone, body, sent_at, read_at
         FROM messages JOIN users ON messages.to_username = users.username
         WHERE from_username = $1`, [username]);

    if (result.rows.length === 0) throw new NotFoundError(`No messages from: ${username}`);

    // TODO: Question: Object shorthand works?
    const messages = result.rows.map(
      msg => {
        return {
          id: msg.id,
          to_user: {
            username: msg.username,
            first_name: msg.first_name,
            last_name: msg.last_name,
            phone: msg.phone
          },
          body: msg.body,
          sent_at: msg.sent_at,
          read_at: msg.read_at,
        };
      }
    );

    return messages;
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {

    const result = await db.query(
      `SELECT id, username, first_name, last_name, phone, body, sent_at, read_at
         FROM messages JOIN users ON messages.from_username = users.username
         WHERE to_username = $1`, [username]
    );

    if (result.rows.length === 0) throw new NotFoundError(`No messages to: ${username}`);

    const messages = result.rows.map(
      msg => {
        return {
          id: msg.id,
          from_user: {
            username: msg.username,
            first_name: msg.first_name,
            last_name: msg.last_name,
            phone: msg.phone
          },
          body: msg.body,
          sent_at: msg.sent_at,
          read_at: msg.read_at,
        };
      }
    );
    return messages;
  }
}


module.exports = User;
