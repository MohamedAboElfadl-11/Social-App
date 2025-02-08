import { Router } from "express";
import * as authService from "./Services/authentication.service.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import * as validation from "../../Validators/auth.schema.js";
import { errorHandlerMiddleware } from "../../Middlewares/error-handler.middleware.js";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";


const authRouters = Router()

authRouters.post(
    "/signup",
    validationMiddleware(validation.signupValidation),
    errorHandlerMiddleware(authService.signupService)
);

authRouters.post(
    "/confirm-email",
    validationMiddleware(validation.verifyEmailValidation),
    errorHandlerMiddleware(authService.verifyEmail)
);

authRouters.post("/login", errorHandlerMiddleware(authService.loginService))

authRouters.get("/refresh-token", errorHandlerMiddleware(authService.refreshTokenService))

authRouters.get("/logout",
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(authService.logoutService),
)

authRouters.patch("/forget-password",
    validationMiddleware(validation.forgetPasswordValidation),
    errorHandlerMiddleware(authService.forgetPasswordService)
)

authRouters.patch("/reset-password",
    validationMiddleware(validation.resetPasswordValidation),
    errorHandlerMiddleware(authService.resetPasswordService)
)

authRouters.post("/gmail-login", errorHandlerMiddleware(authService.loginGmailService))
authRouters.post("/gmail-signup", errorHandlerMiddleware(authService.signupGmailService))

export default authRouters