const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  img:String,
  files:String,
  imgId:String,
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array to store user IDs who liked the post
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
      text: { type: String, required: true }, 
      createdAt: { type: Date, default: Date.now }, // Comment creation date
    },
  ],
});



module.exports = mongoose.model('Post', postSchema)
