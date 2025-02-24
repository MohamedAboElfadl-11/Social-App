import { Router } from 'express'
import { authenticationMiddleware } from '../../Middlewares/authentication.middleware.js'
import * as post from './Services/post.service.js'
import { errorHandlerMiddleware } from '../../Middlewares/error-handler.middleware.js'
import { checkUserMiddleware } from '../../Middlewares/check-users.middleware.js'

const postRouter = Router()

postRouter.post("/create-post",
    errorHandlerMiddleware(authenticationMiddleware()),
    checkUserMiddleware,
    errorHandlerMiddleware(post.addPostService)
)

postRouter.get('/list-posts',
    errorHandlerMiddleware(post.listPosts)
)

export default postRouter