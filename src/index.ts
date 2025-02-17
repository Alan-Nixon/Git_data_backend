import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import 'dotenv/config'
import './db/connectDB'
import Router from './Routes/route'


const app = express()

app.use(express.json())
app.use(logger("dev"))
app.use(cors({
    origin:process.env.CLIENT_URL ?? "http://localhost:5173"
}))

app.use("/",Router)

app.listen(process.env.PORT, () => {
    console.log(`server started listen on http://localhost:${process.env.PORT}`)
})
