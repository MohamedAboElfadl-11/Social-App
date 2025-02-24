import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    allowedComments: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

export const PostModel = mongoose.models.Post || mongoose.model('posts', postSchema)