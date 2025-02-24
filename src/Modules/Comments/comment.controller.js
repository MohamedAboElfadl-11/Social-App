import { Router } from "express";
import { errorHandlerMiddleware } from "../../Middlewares/error-handler.middleware.js";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
import * as comment from "./Services/comment.service.js";
import { checkUserMiddleware } from "../../Middlewares/check-users.middleware.js";

const commentRouter = Router()

commentRouter.post('/create/:commentOnId',
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(checkUserMiddleware),
    errorHandlerMiddleware(comment.addComment)
)

commentRouter.get("/list-comment",
    errorHandlerMiddleware(comment.listComment)
)

export default commentRouter