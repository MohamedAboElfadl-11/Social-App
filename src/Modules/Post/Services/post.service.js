/**
 * @api /post/create
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<Response>}
 * @description create post for user
 */

import PostModel from "../../../DB/Models/post.model.js";

// create posts
export const addPostService = async (req, res) => {
    const { _id: ownerId } = req.authUser;
    const { title, description, tags, allowedComments } = req.body
    let postData = { ownerId, title, description, allowedComments, tags };
    const post = await PostModel.create(postData)
    res.status(200).json({ message: "Post created successfully", post })
}

// list all of posts in Home page
export const listPosts = async (req, res) => {
    const posts = await PostModel.find().populate(
        [
            {
                path: 'comments',
            }
        ]
    )
    res.status(200).json({ posts })
}