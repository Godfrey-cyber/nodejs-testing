import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import mongoose from "mongoose"
import userRoutes from './routes/userRoute.js'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
	// origin: process.env.CLIENT_URL,
	// origin: process.env.CLIENT_URL,
	credentials: true
}))

const MONGO_URL = process.env.MONGO_URL
// const PORT = process.env.PORT || 5000

mongoose.connect(MONGO_URL)
mongoose.connection.on("disconnected", (error) => {
    console.log("❌ MongoDatabase disconnected❗", error)
});

app.use('/api/v1/users', userRoutes)

// app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

export default app