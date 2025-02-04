import express from "express"
import database_connection from "./DB/connect.js"
import { config } from 'dotenv'
import path from "path"
import controllerHandler from "./Utils/routers-handler.js"

if (process.env.NODE_ENV === "dev") config({ path: path.resolve(`src/Config/.dev.env`) })
config();

const boostrap = function () {
    const app = express()
    app.use(express.json())
    controllerHandler(app)
    const PORT = process.env.PORT
    database_connection()
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    })
}

export default boostrap;