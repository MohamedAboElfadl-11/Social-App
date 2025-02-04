import mongoose from "mongoose"

const database_connection = () => {
    try {
        mongoose.connect(process.env.DB_URL)
        console.log(`Database Connected db_social_app ✅`)
    } catch (error) {
        console.log(`Connection Failed ❌`)
    }
}

export default database_connection