import User from "../models/userModel.js"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
	const { username, email, password } = req.body;
    // check all fields
    if (!email || !password || !username) {
        return res.status(400).json({ msg: '❌ Please enter all fields' })
    }
    // Email validation
    let emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!email.match(emailFormat)) {
        return res.status(400).json({ msg: "❌ Please enter a valid email address❗" })
    }
    //Password Verification
    let passValid=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (!password.match(passValid)) {
        return res.status(400).json({ msg: "🚫 Password must be between 8 to 15 characters containing at least one lowercase letter, one uppercase letter, one numeric digit, and one special character" })
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({ username, email, password: hashedPassword });

        jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET_TOKEN, {}, (error, token) => {
            if(error) {
                console.log(error)
                return res.status(500).json({msg: "Something went wrong! Please try again later"}) 
            }
            res.cookie('token', token, {
                path: '/',
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 86400),
                sameSite: "none",
                secure: process.env.NODE_ENV === 'production'
            }).status(201).json({_id: user._id, username: user.username, token, msg: "User Registration successfull🥇"})
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({msg: "Something went wrong! Please try again later", error})
    }
}