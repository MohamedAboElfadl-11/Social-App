import { Router } from "express";
import { signupService, verifyEmail } from "./Services/authentication.service.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import * as validation from "../../Validators/auth.schema.js";
import { errorHandlerMiddleware } from "../../Middlewares/error-handler.middleware.js";

const authRouters = Router()

authRouters.post("/signup", validationMiddleware(validation.signupValidation), errorHandlerMiddleware(signupService))
authRouters.post("/confirm-email", validationMiddleware(validation.verifyEmailValidation), errorHandlerMiddleware(verifyEmail))

export default authRouters