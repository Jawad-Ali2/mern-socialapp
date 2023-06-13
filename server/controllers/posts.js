import User from "../models/User.js";
import Post from "../models/Post.js";

// CREATE //

export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath} = req.body;
        const user = await User.findById(userId);
        const newPost = new Post ({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        });
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({message: err.message});
    }
}

// READ //
export const getFeedPosts = async(req, res) =>
{
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const getUserPosts = async (req, res) =>
{
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}


// UPDATE //
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id); // Grabbing post information
        const isLiked = post.likes.get(userId); // Grabbing whether the user like it or not

        if (isLiked) { // If it is likes by user
            post.likes.delete(userId); // We delete the user
        } else { // If it is non existant 
            post.likes.set(userId, true);  // Then we are going to set it to like
        }

        const updatedPost = await Post.findByIdAndUpdate( // Depending on what isLiked is we are going to update our post
            id,
            { likes: post.likes }, // By finding it first
            { new: true } // Then giving it new likes
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};