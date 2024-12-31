import User from "../models/userModel.js"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createRefreshToken, createAccessToken, validateEmail, validatePassword } from "../utilities/utiles.js"

export const registerUser = async (req, res) => {
    try {
    	const { username, email, password } = req.body;
        // check all fields
        if (!email || !password || !username) {
            return res.status(400).json({ msg: '❌ Please enter all fields' })
        }

        // Email validation
        validateEmail(email, res) // Ensures that email is a valid one
        validatePassword(password, res) // pasword meets the criteria

        // existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        
        //Create user
        const user = new User({ username, email, password });
        await user.save()

        // Generate tokens
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);

        // send refreshtoken via httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "none",
            secure: process.env.NODE_ENV === 'production'
        })
        res.status(201).json({ accessToken, msg: "User Registration successfull🥇"})
    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}

// login user
export const loginUser = async(req, res) => {
    try{
        const {password, email} = req.body
        if(!email || !password) {
            return res.status(400).json({msg: '❌ Please fill in all fields'})
        }

        validateEmail(email, res) // Ensures that email is a valid one
        validatePassword(password, res) // pasword meets the criteria

        // check if user exists
        const userExists = await User.findOne({ email })
        if (!userExists) return res.status(400).json({msg: "🚫 This email does not exist!"})

        const ifPasswordIsCorrect = await bcrypt.compare(password, userExists.password)
        console.log(ifPasswordIsCorrect)
        if(!ifPasswordIsCorrect) return res.status(400).json({msg: "🚫 Invalid email or password."})

        // Generate tokens
        const accessToken = createAccessToken(userExists._id);
        const refreshToken = createRefreshToken(userExists._id);
        if (userExists && ifPasswordIsCorrect) {
            res.cookie('refreshToken', refreshToken, {
                path: "/",
                httpOnly: true,
                // maxAge: new Date(Date.now() + 1000 * 86400),
                sameSite: "none",
                secure: process.env.NODE_ENV === 'production'
            })
            res.status(200).json({ accessToken, msg: "Login successfull🥇" })
        }
    }catch(error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}

export const getUsers = async(req, res) => {
    console.log(req.query.username)
    try{
        const users = req.query.new ? await User.find().sort({ createdAt: -1} ).limit(5).select("-password") : await User.find().select("-password")
        return res.status(200).json({ users, status: 'Success', count: users.length })
    } catch(error) {
        return res.status(500).json({ status: 'Fail', msg: error.message })
    }
}

// Refresh token
export const tokenRefresh = (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(403).json({ message: "Refresh token not provided" });
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
        if (error) return res.status(403).json({ message: "Invalid refresh token" });

        const accessToken = createAccessToken(decoded.userId);
        res.status(200).json({ accessToken });
    });
}