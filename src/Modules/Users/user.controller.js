import { Router } from "express";
import { Multer } from "../../Middlewares/multer.middleware.js";
import { errorHandlerMiddleware } from "../../Middlewares/error-handler.middleware.js";
import { uploadProfilePic } from "./Services/upload-profile-pic.service.js";
import { ImageExtentions } from "../../Constants/constatnts.js";

const userRouters = Router();

userRouters.post("/upload-profile-pic",
    Multer('Users/Profile', ImageExtentions).single('image'),
    errorHandlerMiddleware(uploadProfilePic)
)

export default userRouters