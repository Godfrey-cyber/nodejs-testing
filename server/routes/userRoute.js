import express from 'express'
import { authenticate } from "../utilities/authMiddleWare.js"
import { registerUser, loginUser, getUsers, tokenRefresh, changePassword } from '../controllers/users.js'

const router = express.Router()

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.get("/get-users", getUsers);
router.patch("/change-password", authenticate, changePassword);

export default router