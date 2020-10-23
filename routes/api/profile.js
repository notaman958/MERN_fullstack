const express = require("express");
const router = express.Router();
const Profile = require("../../models/profile");
const auth = require("../../middleware/auth");
const user = require("../../models/User");
const { check, validationResult } = require("express-validator");

//GET PROFILE ME
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

//CREATE  AND UPDATE profile
//@ route       POST api/profile/
//@des         create or update user profile
//@access      private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is empty").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // must req,res in order
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;
    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    // get from the req.body
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills)
      profileFields.skills = skills.split(",").map((skill) => skill.trim()); // cut word after , => trim space out of word
    console.log(profileFields.skills);
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (Profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      // create new
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "server error" });
    }
  }
);

//GET ALL PROFILE
//@ route       GET api/profile/
//@des          get all profile
//@access      public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server error" });
  }
});

//GET ONE PROFILE WITH ID
//@ route       GET api/profile/
//@des          get all profile
//@access      public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server error" });
  }
});
module.exports = router;
