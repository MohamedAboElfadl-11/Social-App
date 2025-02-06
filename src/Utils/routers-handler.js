import { globalErrorHandler } from "../Middlewares/error-handler.middleware.js"
import authRouters from "../Modules/Auth/auth.controller.js"
import userRouters from "../Modules/Users/user.controller.js"

const controllerHandler = (app, express) => {
    app.use('/Assets', express.static('Assets'))
    app.use("/auth", authRouters)
    app.use("/user", userRouters)
    app.use(globalErrorHandler)
}

export default controllerHandler