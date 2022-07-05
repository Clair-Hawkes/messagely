"use strict";

const Router = require("express").Router;
const router = new Router();
const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const { BadRequestError,UnauthorizedError } = require("../expressError");
const jwt = require("jsonwebtoken");


/** POST /login: {username, password} => {token} */
router.post("/login", async function (req, res) {
  const { username, password } = req.body;

  const authResult = await User.authenticate(username, password);
  // const newLoginTime = await User.updateLoginTimestamp(username);
  // TODO: Variable vs. no variable?
  await User.updateLoginTimestamp(username);



  if (authResult === true) {
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  }

  throw new UnauthorizedError("Invalid user/password");

});


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post("/register", async function (req,res){
  const {username, password, first_name, last_name, phone} = req.body;

  try{
    const newUser = await User.register({
                                        username,
                                        password,
                                        first_name,
                                        last_name,
                                        phone,
  });
  } catch (error){
    throw new BadRequestError("Invalid/Duplicate Username");
  }

  //TODO: Logs In Anything needed?
  const token = jwt.sign({ username }, SECRET_KEY);
  return res.json({ token });
})



module.exports = router;
