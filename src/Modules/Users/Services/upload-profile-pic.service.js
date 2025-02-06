export const uploadProfilePic = async (req, res, next) => {
    res.status(200).json({ message: "profile pic uploaded", uploadedFile: req.file })
}