import express from "express";
import auth from "../middleware/auth.js";
import { login, registerUser, getLoginUser } from "../controllers/user.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/me", auth, getLoginUser);

// NOT FOUND
router.all("/*", (req, res) =>
  res.status(404).json({ message: "Path is not exist." })
);

export default router;
