import express from "express"

const app = express()

app.post("/create-user", (req, res) => {
	res.send("Hello")
})

export default app