const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../model/post');
const { authMiddleware, isAdminMiddleware } = require('../utils/authMiddleware');
const { secretKey } = require('../utils/const/config-const');
const router = express.Router();
const cloudinary = require("cloudinary").v2; // platform for upload file here.

function verifyToken(token, res) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, function (err, decoded) {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        resolve(decoded);
      }
    });
  });
}

// Configuration
cloudinary.config({
  cloud_name: "dti8kpm5d",
  api_key: "312751717784482",
  api_secret: "a0Mw1XIVPe-EkEflZeKuykb8iHk",
});



// DELETE a post
router.post("/deletePost", authMiddleware, async (req, res) => {
  try {
    const decoded = await verifyToken(req.headers.authorization.split(' ')[1]); // Authorization: 'Bearer TOKEN'
    const userId = decoded.id;
    const { id, imgId } = req.body;
    // Find the post by its ID
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user who created the post matches the current authenticated user
    if (String(post.user) !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    // Delete the post
    cloudinary.uploader.destroy(imgId, async (destroyErr, destroyResult) => {
      if (destroyErr) {
        console.error('Error deleting the image from Cloudinary:', destroyErr);
      }
      await Post.deleteOne({ _id: id });
      return res.status(200).json({ success: true, message: 'Post deleted successfully' });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/likePost", async (req, res) => {
  try {
    const { postId } = req.body;
    const decoded = await verifyToken(req.headers.authorization.split(' ')[1], res); // Authorization: 'Bearer TOKEN'
    const userId = decoded.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // User has already liked the post, so we remove the like
      await post.updateOne({ $pull: { likes: userId } });
      return res.status(200).json({ success: true, message: 'Post unliked successfully' });
    } else {
      // User hasn't liked the post, so we add the like
      await post.updateOne({ $addToSet: { likes: userId } });
      return res.status(200).json({ success: true, message: 'Post liked successfully' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Comment on a post
router.post("/commentPost", async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const decoded = await verifyToken(req.headers.authorization.split(' ')[1]); // Authorization: 'Bearer TOKEN'
    const userId = decoded.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create the comment object
    const newComment = {
      user: userId,
      text: comment,
    };

    // Add the comment to the post's comments array
    post.comments.push(newComment);
    await post.save();

    return res.status(200).json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//search posts
router.get('/search/post', authMiddleware, async (req, res) => {
  const searchTerm = req.query.q; // Get the search term from the query string

  try {
    // Perform the search using regular expressions
    if (searchTerm === '') {
      res.status(200).json({ success: true, results: [] })
    } else {
      const searchResults = await Post.find({
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive match on the 'name' field
        ],
      }).populate("user", "-password -email -contact");

      res.json({ success: true, results: searchResults });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = { router };