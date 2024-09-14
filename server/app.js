import express from "express"

const app = express()
app.use(express.json())

app.post("users/create-user", async (req, res) => {
	const { password, username, userId } = req.body
	if (!password || !username) {
		return res.status(404)
	}
	res.status(201).json({ username: "Godfrey", password: "123456", userId: 0, message: "User created successfully" })
})

app.get("users/get-users", async (req, res) => {
	const users = { username: "Godfrey", password: "123456", id: 1 }
	res.status(200).json({ user, message: "User created successfully" })
})

export default app