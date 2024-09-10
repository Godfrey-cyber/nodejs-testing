import express from "express"

const app = express()
app.use(express.json())

app.post("users/create-user", async (req, res) => {
	const { password, username, userId } = req.body
	if (!password || !username) {
		return res.status(404)
	}
	res.status(201).json({ username: "Godfrey", password: "123456", userId: 0 })
})

export default app