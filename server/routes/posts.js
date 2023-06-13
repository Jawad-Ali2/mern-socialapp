import express from "express";
import {getFeedPosts, getUserPosts, likePost} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ //
router.get("/", verifyToken, getFeedPosts); // Sends all the post in the database
router.get("/:userId/posts", verifyToken, getUserPosts);


// UPDATE //
router.patch("/:id/like", verifyToken, likePost);

export default router;