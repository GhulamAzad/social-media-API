import express from 'express';
import auth from '../middleware/auth.js';
import { getPosts, getPost, createPost, deletePost, likePost, unlikePost, commentPost } from '../controllers/posts.js';
import { authenticateUser, registerUser, followUser, unfollowUser, getUser } from '../controllers/user.js';


const router = express.Router();

// Get Request
router.get('/all_posts', auth, getPosts);
router.get("/posts/:id", auth, getPost);
router.get('/user', auth, getUser);

// Post Request
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.post("/posts", auth, createPost);
router.post('/comment/:id', auth, commentPost)
router.post('/follow/:id', auth, followUser)
router.post('/unfollow/:id', auth, unfollowUser)
router.post('/like/:id', auth, likePost)
router.post('/unlike/:id', auth, unlikePost)


// Delete Request
router.delete('/posts/:id', auth, deletePost);

// NOT FOUND
router.all("/*", (req, res) => res.status(404).json({ message: "Path is not exist." }));


export default router;