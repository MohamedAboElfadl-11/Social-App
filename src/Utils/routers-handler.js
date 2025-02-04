import { globalErrorHandler } from "../Middlewares/error-handler.middleware.js"
import authRouters from "../Modules/Auth/auth.controller.js"

const controllerHandler = (app)=> {
    app.use("/auth", authRouters)
    app.use(globalErrorHandler)
}

export default controllerHandler