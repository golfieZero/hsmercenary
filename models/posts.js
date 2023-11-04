import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    cards: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Card',
          required: true
        },
      ],
});

// const Post = mongoose.model('Post', postSchema);

// module.exports = Post;
export default mongoose.model('Post', postSchema)
