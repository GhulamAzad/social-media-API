import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import User from '../models/user.js'

export const getUser = async (req, res, next) => {
    try {
        if (!req.userId)
            throw new Error("Unauthenticated");

        const { _id: user_id, name, email, following, followers, createdAt } = await User.findById(req.userId);
        res.status(200).json({ user_id, name, email, followers: followers.length, following: following.length, createdAt });
    } catch (err) {
        next(err);
    }
}

export const authenticateUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser)
            return res.status(404).json({ message: "User doesn't exist." });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect)
            return res.status(400).json({ message: "invalid credentials." });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '16h' });
        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
}

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser)
            return res.status(400).json({ message: "User already exist." });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User({
            name, email, password: hashedPassword
        });
        await newUser.save();
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
}


export const followUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!req.userId)
            throw new Error("Unauthenticated");

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send("Invalid id");

        // fecth the user of given and login user
        const user = await User.findById(id);
        const currentUser = await User.findById(req.userId);

        // Update the following
        let index = currentUser.following.findIndex(id => id.toString() === user._id.toString());
        if (index === -1)
            currentUser.following.push(user);


        // Update the followers
        index = user.followers.findIndex(id => id.toString() === currentUser._id.toString());
        if (index === -1) {
            user.followers.push(currentUser);
        }

        // changes save in to db
        await User.findByIdAndUpdate(id, user, { new: true });
        const { _id: user_id, name, email, following, followers, createdAt } = await User.findByIdAndUpdate(req.userId, currentUser, { new: true });

        res.status(200).json({ user_id, name, email, followers: followers.length, following: following.length, createdAt });
    } catch (err) {
        next(err);
    }
}


export const unfollowUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!req.userId)
            throw new Error("Unauthenticated");

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send("Invalid id");

        // fecth the user of given and login user
        const user = await User.findById(id);
        const currentUser = await User.findById(req.userId);

        // unfollowing
        currentUser.following = currentUser.following.filter(id => id.toString() !== user._id.toString());

        // decrease the followers
        user.followers = user.followers.filter(id => id.toString() !== currentUser._id.toString());


        // changes save in to db
        await User.findByIdAndUpdate(id, user, { new: true });
        const { _id: user_id, name, email, following, followers, createdAt } = await User.findByIdAndUpdate(req.userId, currentUser, { new: true });

        res.status(200).json({ user_id, name, email, followers: followers.length, following: following.length, createdAt });
    } catch (err) {
        next(err);
    }
}