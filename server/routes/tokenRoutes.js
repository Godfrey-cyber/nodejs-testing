import express from 'express'
import { tokenRefresh } from '../controllers/users.js'

const router = express.Router()

router.post("/refresh-token", tokenRefresh);

export default router