import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    commentOnId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true
    },
    onModel: {
        type: String,
        enum: ['posts', 'comments']
    }
}, { timestamps: true })

const CommentModel = mongoose.models.comments || mongoose.model('comments', commentSchema)

export default CommentModel