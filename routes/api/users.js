const express = require("express");
const router = express.Router();
const config = require("config");
// express validator
const { check, validationResult } = require("express-validator");
// require model for checking user input
const User = require("../../models/User");
// gravatar
const gravatar = require("gravatar");
// brypt
const brypt = require("bcryptjs");
// jswebtoken
const jwt = require("jsonwebtoken");

//@ route       POST api/users to register user
//@des         test route
//@access      public
// check post header post 'content-type:application/json' object {"name":"sfhjd"} POSTMAN
// curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "ydsjfndj"}' http://localhost:5001/api/users
router.post(
  "/",
  // validation
  //name: message and not null
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is invalid").isEmail(),
    check("password", "Password is at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      // check existing email
      let user = await User.findOne({ email });

      if (user) {
        // should have return to pass the error res header sent
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      // get users gavartar
      const avatar = gravatar.url(email, {
        // size
        s: "200",
        // rating permitted G images allowed
        r: "pg",
        //default img for non avatar
        d: "mm",
      });
      user = new User({
        name,
        email,
        avatar,
        password, // not yet encrypted
      });

      // encrypt pass
      const salt = await brypt.genSalt(10); // the more secure but slow
      user.password = await brypt.hash(password, salt);
      await user.save();
      // return jsonwebtoken // user login rightaway
      //while await
      const payload = {
        user: {
          id: user.id, // _id
        },
      };
      jwt.sign(
        payload,
        config.get("jwt"),
        { expiresIn: 7200 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
