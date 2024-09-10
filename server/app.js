import express from "express"

const app = express()

app.post("/create-user", (req, res) => {
	res.status(200).json({ username: "Godfrey", password: "123446" })
})

export default app