import { Router } from "express";
import { Multer } from "../../Middlewares/multer.middleware.js";
import { errorHandlerMiddleware } from "../../Middlewares/error-handler.middleware.js";
import { uploadProfilePic } from "./Services/upload-profile-pic.service.js";
import { ImageExtentions } from "../../Constants/constatnts.js";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
import { getProfileDataService, updateProfileService } from "./Services/profile.service.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import { updateProfileValidation } from "../../Validators/user.schema.js";

const userRouters = Router();

userRouters.get("/profile",
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(getProfileDataService)
)

userRouters.post("/upload-profile-pic",
    Multer('Users/Profile', ImageExtentions).single('image'),
    errorHandlerMiddleware(uploadProfilePic)
)

userRouters.patch("/update-data",
    validationMiddleware(updateProfileValidation),
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(updateProfileService)
)

export default userRouters