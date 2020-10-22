const express = require("express");
const router = express.Router();
const Profile = require("../../models/Profile");
const auth = require("../../middleware/auth");
const user = require("../../models/User");
//@ route       GET api/profile/me
//@des         test route
//@access      private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "No profile found" });
    }
    res.send(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
