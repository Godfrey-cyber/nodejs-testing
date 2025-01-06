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

         // Validate password format
        try {
            validatePassword(password);
        } catch (error) {
            return res.status(400).json({ msg: error.message });
        }

        // Validate email format
        try {
            validateEmail(email);
        } catch (error) {
            return res.status(400).json({ msg: error.message });
        }

        // existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        
        //Create user
        const user = new User({ username, email, password });
        await user.save()
        console.log("new registered user", user)
        return res.status(201).json({ msg: "User Registration successfull🥇" })
    } catch(error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

// login user
export const loginUser = async(req, res) => {
    try{
        const {password, email} = req.body
        if(!email || !password) {
            return res.status(400).json({msg: '❌ Please fill in all fields'})
        }

        // Validate password format
        try {
            validatePassword(password);
        } catch (error) {
            return res.status(400).json({ msg: error.message });
        }

        // Validate email format
        try {
            validateEmail(email);
        } catch (error) {
            return res.status(400).json({ msg: error.message });
        }

        // check if user exists
        const userExists = await User.findOne({ email })
        if (!userExists) {
            return res.status(400).json({msg: "🚫 This email does not exist!"})
        }
       
        const ifPasswordIsCorrect = await bcrypt.compare(password, userExists.password)
        console.log("password correct", ifPasswordIsCorrect)
        if (!ifPasswordIsCorrect) {
            return res.status(400).json({ msg: "🚫 Invalid email or password." });
        }

        // Generate tokens
        const accessToken = createAccessToken(userExists._id);
        const refreshToken = createRefreshToken(userExists._id);

        // Send refresh token to the front-end
        res.cookie('refreshToken', refreshToken, {
            path: "/",
            httpOnly: true,
            maxAge: new Date(Date.now() + 1000 * 86400),
            sameSite: "Strict",
            secure: process.env.NODE_ENV === 'production'
        })
        res.status(200).json({ accessToken, msg: "Login successfull🥇" })
    }catch(error) {
        console.log(error.message)
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

// Change Password 
export const changePassword = async(req, res) => {
    try {
        const { previousPassword, password } = req.body;
        // Validate user fields
        if (!previousPassword || !password) return res.status(400).json({ message: "❌ Please enter all fields." });
        // Validate password format
        try {
            validatePassword(password);
        } catch (error) {
            return res.status(400).json({ msg: error.message });
        }
        // Fetch user from the database
        const user = await User.findById(req.userId);

        if (!user) return res.status(401).json({ message: "❌ User not found. Please log in again." });
        // Check if the previous password matches the user's current password
        const isPasswordMatch = await bcrypt.compare(previousPassword, user.password);
        console.log("is password match", isPasswordMatch)

        if (!isPasswordMatch) {
            throw new Error("🚫 Incorrect previous password. Please try again.");
        }

        try {
            validatePassword(password); // Throws an error if validation fails
        } catch (validationError) {
            return res.status(400).json({ message: validationError.message });
        }

        // Update and save the new password
        user.password = password;
        await user.save();
        console.log("change password", user)

        res.status(200).json({ message: "✅ Password has been changed successfully!" });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

// Logout 
export const logout = async(req, res) => {
    res.cookie('refreshToken', "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "Strict",
        secure: true
    })
    return res.status(200).json({message: "User has been successfully logged out"})
}