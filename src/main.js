import express from "express"
import database_connection from "./DB/connect.js"
import { config } from 'dotenv'
import path from "path"
import controllerHandler from "./Utils/routers-handler.js"
import cors from "cors"

if (process.env.NODE_ENV === "dev") config({ path: path.resolve(`src/Config/.dev.env`) })
config();


const whitelist = [process.env.FRONTEND_CORS_ORIGINS]
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

const boostrap = function () {
    const app = express()
    app.use(express.json())  
    app.use(cors(corsOptions))
    controllerHandler(app, express)
    const PORT = process.env.PORT
    database_connection()
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    })
}

export default boostrap;