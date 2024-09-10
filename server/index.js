import express from 'express'
import dotenv from 'dotenv'

const app = express()

app.get("/test", (req, res) => {
	res.send("Hello")
})

app.listen(8080, console.log("Listening on port 8080"))
