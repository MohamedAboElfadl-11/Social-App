import { Router } from 'express'
import { authenticationMiddleware } from '../../Middlewares/authentication.middleware.js'
import { addPostService } from './Services/post.service.js'

const postRouter = Router()

postRouter.post("/create-post",
    authenticationMiddleware(),
    addPostService
)

export default postRouter