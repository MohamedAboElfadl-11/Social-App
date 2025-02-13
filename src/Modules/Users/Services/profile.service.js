import UserModel from "../../../DB/Models/user.model.js";
import { emitter } from "../../../Services/sending-email.service.js";
import { comparing, decryption, encryption, hashing } from "../../../Utils/crypto.js";
import emailTemplate from "../../../Utils/email-temp.js";
import { DateTime } from "luxon";

// Get profile Data
export const getProfileDataService = async (req, res) => {
    const user = req.authUser
    const userPhone = decryption(user.phone, process.env.SECRET_KEY)
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
export const updateProfileService = async (req, res) => {
    const user = req.authUser
    const { username, email, phone, DOB } = req.body;
    let updatedData = {}
    // update email and confirm it with OTP
    if (email) {
        const isEmailExist = await UserModel.findOne({ email })
        if (isEmailExist) return res.status(409).json({ message: "email already exist" })
        // generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpiration = DateTime.now().plus({ minutes: 10 }).toJSDate();
        // hashing OTp
        const hashedOtp = hashing(otp, +process.env.SALT)
        // send verification email with OTP
        emitter.emit('sendEmail', {
            subject: "Your OTP code",
            to: email,
            html: emailTemplate(user.username, otp)
        })
        updatedData.confirm_otp = hashedOtp
        updatedData.confirm_otp_exp_time = otpExpiration
        updatedData.email = email
        updatedData.isEmailVerified = false
    }
    if (phone) updatedData.phone = encryption(phone, process.env.SECRET_KEY)
    if (username) updatedData.username = username
    if (DOB) {
        const birthDay = DateTime.fromISO(DOB);
        const now = DateTime.now();
        const age = Math.floor(now.diff(birthDay, "years").years);
        updatedData.age = age
        updatedData.DOB = DOB
    }
    console.log(updatedData)
    await UserModel.findByIdAndUpdate(user._id, updatedData, { new: true })
    updatedData.phone = decryption(updatedData.phone, process.env.SECRET_KEY)
    res.status(201).json({ message: "Your Data updated successfully", updatedData })
}
// update password service
export const updatePasswordService = async (req, res) => {
    const user = req.authUser;
    const { oldPassword, password, confirmPassword } = req.body;
    const isPasswordMatched = await comparing(oldPassword, user.password)
    if (!isPasswordMatched) return res.status(409).json({ message: "wrong old password" })
    const hashedPassword = hashing(password, +process.env.SALT)
    await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword })
    res.status(200).json({ message: "password updated successfully" })
}
// Delete account service
export const deleteAccountService = async (req, res) => {
    const user = req.authUser;
    await UserModel.findByIdAndDelete(user._id)
    res.status(200).json({ message: 'Account deleted successfully' });
}
