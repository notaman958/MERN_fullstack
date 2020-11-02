const express = require("express");
const router = express.Router();
const Profile = require("../../models/profile");
const auth = require("../../middleware/auth");
const user = require("../../models/User");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Post = require("../../models/Post");
// for git repos
const request = require("request");
const config = require("config");

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
      hobbies,
      facebook,
      instagram,
      linkedin,
      youtube,
      twitter,
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
    if (hobbies)
      profileFields.hobbies = hobbies.split(",").map((hobby) => hobby.trim());
    // build social obj
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
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
      console.error(err.message);
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
//@ route       GET api/profile/user/:user_id
//@des          get  profile by user id
//@access      public
router.get("/user/:user_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    return res.json(profile);
  } catch (err) {
    console.error(err);
    if (err.kind == "ObjectId")
      return res.status(400).json({ msg: "Profile not found" });
    res.status(500).json({ msg: "server error" });
  }
});

//deLETE api/profile
//@ route       DELETE api/profile/
//@des         delete prfile, user and posts
//@access      private
router.delete("/", auth, async (req, res) => {
  try {
    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id }); // model has field
    // remove user
    await User.findOneAndRemove({ _id: req.user.id }); // model has field _id
    // remove post
    // updated later
    await Post.deleteMany({ user: req.user.id });
    console.log("delete acc + profile + posts");
    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err);
    if (err.kind == "ObjectId")
      return res.status(400).json({ msg: "Profile not found" });
    res.status(500).json({ msg: "server error" });
  }
});

//PUT
//@ route       PUT api/profile/experience
//@des         add profile experience
//@access      private
router.put(
  "/experience",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, from, to, current, description } = req.body;
    const profileObj = {
      title,
      company,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(profileObj); // add tail
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

//POST
//@ route       PUT api/profile/social
//@des         add profile experience
//@access      private
router.post("/social", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { facebook, twitter, linkedin, instagram, youtube } = req.body;
  const profileObj = {
    facebook,
    twitter,
    linkedin,
    instagram,
    youtube,
  };
  if (facebook) profileObj.facebook = facebook;
  if (twitter) profileObj.twitter = twitter;
  if (linkedin) profileObj.linkedin = linkedin;
  if (instagram) profileObj.instagram = instagram;
  if (youtube) profileObj.youtube = youtube;
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      console.log(profile.social);
      profile.social = profileObj;
      await profile.save();
    } else return res.status(404).json({ msg: "Profile not found" });
    console.log(profile);
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//deLETE experience
//@ route       DELETE api/profile/
//@des         delete experience from profile
//@access      private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    // remove profile
    const profile = await Profile.findOne({ user: req.user.id }); // model has field

    // const removeIndex = profile.experience
    //   .map((item) => item.id)
    //   .indexOf(req.params.exp_id);
    // console.log(removeIndex);
    // profile.experience.splice(removeIndex, 1);
    // ERROR not found return -1 => splice(-1,1) delete last el
    profile.experience = profile.experience.filter(
      // experience obj has _id because its a subdocument
      (exp) => exp.id.toString() !== req.params.exp_id
    );
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server error" });
  }
});

//PUT
//@ route       PUT api/profile/education
//@des         add profile education
//@access      private
router.put(
  "/education",
  [
    auth,
    check("school", "school is required").not().isEmpty(),
    check("degree", "degree is required").not().isEmpty(),
    check("fieldofstudy", "field of study is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;
    const profileObj = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(profileObj); // add head
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

//deLETE education
//@ route       DELETE api/profile/education
//@des         delete experience from profile
//@access      private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    // remove profile
    const profile = await Profile.findOne({ user: req.user.id }); // model has field

    // const removeIndex = profile.experience
    //   .map((item) => item.id)
    //   .indexOf(req.params.exp_id);
    // console.log(removeIndex);
    // profile.experience.splice(removeIndex, 1);
    // ERROR not found return -1 => splice(-1,1) delete last el
    profile.education = profile.education.filter(
      // experience obj has _id because its a subdocument
      (edu) => edu.id.toString() !== req.params.edu_id
    );
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server error" });
  }
});

/// git
//https://github.com/settings/developers
//
//@ route       get api/profile/github/:username
//@des         get user repos from github
//@access      public
router.get("/github/:username", (req, res) => {
  try {
    // need Oauth created
    const options = {
      uri: `http://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientID"
      )}&client_secret=${config.get("githubPass")}}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    //make http call in nodejs
    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200)
        return res.status(404).json({ msg: "No github profile found " });
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server error" });
  }
});

module.exports = router;
