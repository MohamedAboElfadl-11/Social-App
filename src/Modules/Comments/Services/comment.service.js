import CommentModel from "../../../DB/Models/comment.model.js"
import PostModel from "../../../DB/Models/post.model.js"

export const addComment = async (req, res) => {
    const { _id: ownerId } = req.authUser
    const { content, tags, onModel } = req.body // onModel
    const { commentOnId } = req.params // postId || commentId
    let commentData = { content, ownerId, tags }
    if (onModel === 'posts') {
        const post = await PostModel.findOne({ _id: commentOnId, allowedComments: true })
        if (!post) return res.status(400).json({ message: "Post not found or comment not allow comment" })
    } else if (onModel == 'comments') {
        const comment = await CommentModel.findById(commentOnId)
        if (!comment) return res.status(400).json({ message: "comment not found" })
    }
    commentData.commentOnId = commentOnId
    commentData.onModel = onModel
    const comment = await CommentModel.create(commentData)
    res.status(200).json({ message: "Comment created successfully", comment })
}

export const listComment = async (req, res) => {
    const comments = await CommentModel.find().populate(
        [
            {
                path: "commentOnId",
                selact: 'content -_id'
            }
        ]
    ).select('content commentOnId onModel -_id')
    res.status(200).json({ comments })
}