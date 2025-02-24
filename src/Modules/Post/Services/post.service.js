/**
 * @api /post/create
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<Response>}
 * @description create post for user
 */

import PostModel from "../../../DB/Models/post.model.js";
import UserModel from "../../../DB/Models/user.model.js";

// create posts
export const addPostService = async (req, res) => {
    const { _id: ownerId } = req.authUser;
    const { title, description, tags, allowedComments } = req.body
    let postData = {
        ownerId, title, description, allowedComments
    };
    if (tags?.length) {
        const users = await UserModel.find({ _id: { $in: tags } })
        if (users.length !== tags.length)
            return res.status(400).json({ message: "invalid tags" })
        postData.tags = tags
    }
    const post = await PostModel.create(postData)
    res.status(200).json({ message: "Post created successfully", post })
}

// list all of posts in Home page
export const listPosts = async (req, res) => {
    const posts = await PostModel.find().populate(
        [
            {
                path: 'ownerId',
                select: 'username createdAt -_id'
            }
        ]
    ).select('title -_id description ')
    res.status(200).json({ posts })
}