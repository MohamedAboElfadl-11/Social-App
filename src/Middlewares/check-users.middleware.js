import UserModel from "../DB/Models/user.model.js"

export const checkUserMiddleware = async (req, res, next) => {
    let tags = req.body.tags
    if (!Array.isArray(tags))
        tags = [tags]
    if (tags?.length) {
        const users = await UserModel.find({ _id: { $in: tags } })
        if (users.length !== tags.length) return res.status(400).json({ message: "invalid user tags" })
    }
    next()
}
