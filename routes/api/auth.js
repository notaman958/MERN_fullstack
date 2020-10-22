const express = require("express");
const router = express.Router();
const config = require("config");
// for check login
const auth = require("../../middleware/auth");
const user = require("../../models/User");
const { check, validationResult } = require("express-validator/check");
// brypt
const brypt = require("bcryptjs");
// jswebtoken
const jwt = require("jsonwebtoken");

//@ route       GET api/auth
//@des         test route
//@access      public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // req get by the req sent from decoded middleware/auth.js
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Sever error");
  }
});

// validate user login
//@ route       POST api/auth
//@des         test route
//@access      public
router.post(
  "/",
  [
    check("email", "Email is invalid").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // check email
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "Invalid email" }] });
      }
      // check password
      const isMatch = await brypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: "Invalid password" }] });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwt"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;
