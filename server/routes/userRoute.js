import express from 'express'
const router = express.Router()
import { registerUser } from '../controllers/users.js'

router.post("/register-user", registerUser)

export router