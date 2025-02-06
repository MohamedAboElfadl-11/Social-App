import multer from "multer"
import fs from 'fs'

export const Multer = (destinationPath = 'general', allowExtension = []) => {
    // check if folder exist
    const destinationFolder = `Assets/${destinationPath}`
    if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true })
    }
    // diskStorage
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'Assets')
        },
        filename: function (req, file, cb) {
            console.log(file)
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + '__' + file.originalname)
        }
    })
    // file filter
    const fileFilter = (req, file, cb) => {
        if (allowExtension.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file type'), false)
        }
    }
    const upload = multer({ fileFilter, storage })
    return upload
}