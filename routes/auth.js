"use strict";

const Router = require("express").Router;
const router = new Router();
const User = require("../models/user");
const { SECRET_KEY } = require("../config");

/** POST /login: {username, password} => {token} */
router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;

  const authResult = await authenticate(username, password);

  if (authResult === true) {
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  }

  throw new UnauthorizedError("Invalid user/password");

});

// if (user) {
//   if (await bcrypt.compare(password, user.password) === true) {
//     const token = jwt.sign({ username }, SECRET_KEY);
//     return res.json({ token });
//   }


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

module.exports = router;
