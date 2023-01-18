import mongoose from 'mongoose';
import Post from '../models/post.js'
import User from '../models/user.js'


export const getPosts = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new Error("Unauthenticated");

        const currentUser = await User.findById(req.userId);
        const posts = await Post.find({ user: currentUser }, ["_id", "title", "description", "comments", "likes", "createdAt"], { sort: { createdAt: -1 } });

        const updatePost = posts.map(post => {
            const { likes, ...postData } = post._doc;
            postData["likes"] = likes.length;
            return postData;
        });
        res.status(200).json(updatePost);
    } catch (err) {
        next(err);
    }
}


export const getPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!req.userId)
            throw new Error("Unauthenticated");

        const currentUser = await User.findById(req.userId);
        const post = await Post.findOne({ user: currentUser, _id: id }, ["_id", "title", "description", "comments", "likes", "createdAt"], { sort: { createdAt: -1 } }).populate('likes', ["name", "email"]);

        res.status(200).json(post);
    } catch (err) {
        next(err);
    }
}

export const createPost = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        if (!req.userId)
            throw new Error("Unauthenticated");

        const currentUser = await User.findById(req.userId);
        const newPost = new Post({
            title: title,
            description: description,
            user: currentUser
        });

        await newPost.save();
        const { _id, createdAt } = newPost;
        res.status(201).json({
            post_id: _id, title, description, createdAt
        });
    } catch (err) {
        next(err);
    }
}


export const deletePost = async (req, res, next) => {
    try {
        const { id: _id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(404).send("No post with that id");

        await Post.findByIdAndRemove(_id);
        res.status(200).json({ message: "Post deleted successfully." });
    } catch (err) {
        next(err);
    }
}

export const likePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!req.userId)
            throw new Error("Unauthenticated");

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send("No post with that id");

        const currentUser = await User.findById(req.userId);
        const post = await Post.findById(id);

        const index = post.likes.findIndex(id => id.toString() === currentUser._id.toString());

        if (index === -1)
            post.likes.push(currentUser);

        const { _id: post_id, title, description, likes, createdAt } = await Post.findByIdAndUpdate(id, post, { new: true });
        res.status(200).json({ post_id, title, description, likes: likes.length, createdAt });
    } catch (err) {
        next(err);
    }
}


export const unlikePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!req.userId)
            throw new Error("Unauthenticated");

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send("No post with that id");

        const currentUser = await User.findById(req.userId);
        const post = await Post.findById(id);

        const index = post.likes.findIndex(id => id.toString() === currentUser._id.toString());

        post.likes = post.likes.filter(id => id.toString() !== currentUser._id.toString());

        const { _id: post_id, title, description, likes, createdAt } = await Post.findByIdAndUpdate(id, post, { new: true });
        res.status(200).json({ post_id, title, description, likes: likes.length, createdAt });
    } catch (err) {
        next(err);
    }
}

export const commentPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        if (!req.userId)
            throw new Error("Unauthenticated");

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send("No post with that id");

        const post = await Post.findById(id);
        post.comments.push(comment);

        const { _id: post_id, title, description, comments, createdAt } = await Post.findByIdAndUpdate(id, post, { new: true });

        res.status(200).json({
            post_id, title, description, comments, createdAt
        });
    } catch (err) {
        next(err);
    }
}