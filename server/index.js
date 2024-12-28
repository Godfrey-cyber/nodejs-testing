import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import app from "./app.js"


// const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT || 5000


app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
