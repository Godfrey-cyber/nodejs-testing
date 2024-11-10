import express from "express"

const app = express()
app.use(express.json())

app.post("users/create-user", async (req, res) => {
	const { password, username, email } = req.body
	if (!password || !username || !email) {
		return res.status(404).json({ message: "Please enter all fields" })
	}

	const user = {
		name: 'John Doe',
	    email: 'john@example.com',
	    password: 'password123',
	    _id: 0
	}
	res.status(201).json({ user, message: "User created successfully" })
})

app.get("users/get-users", async (req, res) => {
	const users = { username: "Godfrey", password: "123456", id: 1, email: "godfreyndiritu254@gmail.com" }
	res.status(200).json({ user, message: "User created successfully" })
})

export default app