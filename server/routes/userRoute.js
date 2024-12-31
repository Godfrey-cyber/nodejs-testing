import express from 'express'
import { registerUser, loginUser, getUsers, tokenRefresh } from '../controllers/users.js'

const router = express.Router()

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.get("/get-users", getUsers);
router.post("/refresh-token", tokenRefresh);

export default router