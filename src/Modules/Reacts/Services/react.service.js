import { ReactsType } from "../../../Constants/constatnts.js";
import CommentModel from "../../../DB/Models/comment.model.js";
import PostModel from "../../../DB/Models/post.model.js";
import ReactsModel from "../../../DB/Models/react.model.js";

export const addReact = async (req, res) => {
    const { _id: ownerId } = req.authUser;
    const { reactOnId } = req.params;
    const { reactType, onModel } = req.body;
    if (onModel === 'posts') {
        const post = await PostModel.findById(reactOnId)
        if (!post) return res.status(400).json({ message: "Post not found" })
    } else if (onModel == 'comments') {
        const comment = await CommentModel.findById(reactOnId)
        if (!comment) return res.status(400).json({ message: "comment not found" })
    }
    const reacts = Object.values(ReactsType)
    if (!reacts.includes(reactType)) return res.status(400).json({ message: "invalid react" })

    const newReact = await ReactsModel.create({ reactOnId, onModel, ownerId, reactType })
    res.status(200).json({ newReact })
}

export const removeReact = async (req, res) => {
    const { _id: ownerId } = req.authUser;
    const { reactId } = req.params
    const deleteReact = await ReactsModel.findOneAndDelete({ _id: reactId, ownerId })
    if (!deleteReact) return res.status(400).json({ message: "react not found" })
    res.status(200).json({ message: "react deleted successfully" })
}