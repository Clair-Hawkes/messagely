"use strict";

const Router = require("express").Router;
const router = new Router();
const User = require("../models/user");
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");


// TODO: Potentially use
router.use(authenticateJWT);
// router.use(ensureLoggedIn)


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name}, ...]}
 *
 **/

router.get('/', ensureLoggedIn, async function (req, res) {
  const allUsers = await User.all();
  console.log(res.locals);
  return res.json(allUsers);
});


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureCorrectUser, async function (req, res) {
  const username = req.params.username;
  const userDetails = await User.get(username);

  return res.json({ user: userDetails });
});


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to', ensureCorrectUser, async function (req, res) {

  const username = req.params.username;
  const msgsToUser = await User.messagesTo(username);

  return res.json({ messages: msgsToUser });
});




/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', ensureCorrectUser, async function (req, res) {

  const username = req.params.username;
  const msgsFromUser = await User.messagesFrom(username);

  return res.json({ messages: msgsFromUser });

});






module.exports = router;