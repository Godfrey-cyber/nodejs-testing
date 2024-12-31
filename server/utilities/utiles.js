import jwt from "jsonwebtoken";

//Create Access Token
export const createAccessToken = (userId, username) => {
	return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" })
}

//Create Refresh Token
export const createRefreshToken = (userId, username) => {
	return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
}

// Validate email
export const validateEmail = (email, res) => {
	let emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

	if (!email.match(emailFormat)) {
	    return res.status(400).json({ msg: "❌ Please enter a valid email address❗" })
	}
}

// Validate password
export const validatePassword = (password, res) => {
	let passValid=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

	if (!password.match(passValid)) {
	    return res.status(400).json({ msg: "🚫 Password must be between 8 to 15 characters containing at least one lowercase letter, one uppercase letter, one numeric digit, and one special character" })
	}
}