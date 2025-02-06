import BlackListTokensModel from "../../../DB/Models/black-listed-tokens.js";
import { decryption } from "../../../Utils/crypto.js";

// Get profile Data
export const getProfileData = async (req, res) => {
    const user = req.authUser
    const token = req.authUser.token;
    const existingTokens = await BlackListTokensModel.findOne({ tokenId: token.tokenId });
    if (existingTokens) return res.status(401).json({ message: "Token black listed please, Login again" });
    const userPhone = await decryption(user.phone, process.env.SECRET_KEY)
    const userData = {
        email: user.email,
        username: user.username,
        fullname: user.full_name,
        age: user.age,
        gender: user.gender,
        isPublic: user.isPublic,
        bio: user.bio,
        phone: userPhone
    }
    res.status(202).json({ userData })
}

// Update Profile Data [ username, email, phone, DOB, isPublic ]  