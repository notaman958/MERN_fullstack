const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/profile");
const { json } = require("body-parser");

//@ route       POST api/posts
//@des         create a post
//@access      private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password"); // no pw along
      // name avatar nad user id get from user model
      const postInstance = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      const newPost = new Post(postInstance);
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

//@ route       GET api/posts
//@des         get all
//@access      private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // date desc
    // 1 is asc
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@ route       GET api/posts/:id
//@des         get post by id
//@access      private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    res.status(500).send("server error");
  }
});

//@ route       DELETE api/posts/:id
//@des         delete post by id
//@access      private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await post.remove();
    res.json({ msg: "post deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("server error");
  }
});

//@ route       PUT api/posts/like/:id
//@des         like a post by id and auth
//@access      private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id }); // user id is push into obj likes
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@ route       PUT api/posts/like/:id
//@des         unlike a post by id and auth
//@access      private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post hasnt yet been liked" });
    }
    // if has liked
    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id // not add back if user id exist
    );
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("server error");
  }
});

//@ route       PUT api/posts/comments/:id
//@des         add a comment by id and auth
//@access      private
router.post(
  "/comments/:id",
  [auth, [check("text", "Comment text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password"); // no pw along
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      // name avatar nad user id get from user model
      const commentInstance = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(commentInstance);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

//@ route      DELETE api/posts/comments/:id/:cmt_id // need both post id and cmt id
//@des         remove a comment by cmt id + auth + post id
//@access      private
router.delete("/comments/:id/:cmt_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    // get comment
    const comment = await post.comments.find(
      (cmt) => cmt.id === req.params.cmt_id
    ); // false or the comment
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    // check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    post.comments = post.comments.filter(
      (cmt) => cmt.id.toString() !== req.params.cmt_id
    );
    await post.save();
    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});
module.exports = router;
