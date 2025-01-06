import express from 'express'
import { authenticate } from "../utilities/authMiddleWare.js"
import { registerUser, loginUser, getUsers, tokenRefresh, changePassword, logout } from '../controllers/users.js'

const router = express.Router()

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.post("/logout", logout);
router.get("/get-users", getUsers);
router.patch("/change-password", authenticate, changePassword);
router.post("/refresh-token", tokenRefresh);

export default router