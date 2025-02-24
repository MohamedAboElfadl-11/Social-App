import { Router } from "express";
import { addReact, removeReact } from "./Services/react.service.js";
import { errorHandlerMiddleware } from "../../Middlewares/error-handler.middleware.js";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";

const reactRouter = Router();

reactRouter.post("/add/:reactOnId",
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(addReact)
)
reactRouter.delete("/remove/:reactId",
    errorHandlerMiddleware(authenticationMiddleware()),
    errorHandlerMiddleware(removeReact)
)

export default reactRouter