"use strict";

const Router = require("express").Router;
const router = new Router();
const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const { BadRequestError } = require("../expressError");
const jwt = require("jsonwebtoken");


/** POST /login: {username, password} => {token} */
router.post("/login", async function (req, res) {
  const { username, password } = req.body;
  //User.authenticate
  //updateLoginTimestamp?
  const authResult = await authenticate(username, password);

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
  console.log('^^^^^^^^',username, password, first_name, last_name, phone);

  // TODO: Validate inputs?
  // try{
    const newUser = await User.register({
                                        username,
                                        password,
                                        first_name,
                                        last_name,
                                        phone,
  });
    console.log('******************',newUser);
  // } catch (error){
  //   throw new BadRequestError("Invalid Username");
  // }

  //TODO: Logs In Anything needed?
  const token = jwt.sign({ username }, SECRET_KEY);
  console.log('#########################',token);
  return res.json({ token });
})



module.exports = router;
