import User from "../models/userModel.js"
import bcrypt from "bcryptjs"

export const registerUser = async () => {
	const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
}