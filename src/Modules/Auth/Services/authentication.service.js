import BlackListTokensModel from "../../../DB/Models/black-listed-tokens.js";
import UserModel from "../../../DB/Models/user.model.js"
import { emitter } from "../../../Services/sending-email.service.js";
import * as secure from "../../../Utils/crypto.js";
import emailTemplate from "../../../Utils/email-temp.js";
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid";
import forgetPassEmailTemp from "../../../Utils/forget-pass-email-temp.js";
import { DateTime } from "luxon"

// Signup service
export const signupService = async (req, res, next) => {

    const { username, phone, fullName, email, password, confirmPassword, gender, DOB, location, bio, privateAccount } = req.body

    // check email uniquness
    const isEmailExist = await UserModel.findOne({ email })
    if (isEmailExist) return res.status(404).json({ message: "email already exist" })

    // encrypt phone number
    const encryptedPhone = secure.encryption(phone, process.env.SECRET_KEY);

    // hashing password
    const hashedPassword = secure.hashing(password, +process.env.SALT);

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiration = new Date()
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10)

    // change profile state
    const isPublic = !privateAccount

    // hashing OTp
    const hashedOtp = secure.hashing(otp, +process.env.SALT)

    // send verification email with OTP
    emitter.emit('sendEmail', {
        subject: "Your OTP code",
        to: email,
        html: emailTemplate(username, otp)
    })
    const birthDay = DateTime.fromISO(DOB);
    const now = DateTime.now();
    const age = Math.floor(now.diff(birthDay, "years").years);
    // create user account
    const user = new UserModel({
        username,
        email,
        password: hashedPassword,
        phone: encryptedPhone,
        confirm_otp: hashedOtp,
        full_name: fullName,
        confirm_otp_exp_time: otpExpiration,
        gender, DOB, location, bio, isPublic, age
    })
    await user.save()
    res.status(201).json({ message: "Account created successfully" })
}

// confirm email service with OTP 
export const verifyEmail = async (req, res, next) => {
    const { otp, email } = req.body;

    // find email and must be no verified and confirm otp field exists
    const user = await UserModel.findOne({ email, isEmailVerified: false, confirm_otp: { $exists: true } })
    if (!user) return res.status(404).json({ message: "user not found" });

    // check if otp expired or not..!
    if (!user.confirm_otp_exp_time || new Date() > user.confirm_otp_exp_time) return res.status(400).json({ message: "OTP has expired. Please request a new one." });

    // compare user OTP and inpot OTP
    const isOtp = await secure.comparing(otp.toString(), user.confirm_otp);
    if (!isOtp) return res.status(401).json({ message: "otp not valid" })

    // update account status and verify it and make OTP used onetime
    await UserModel.findByIdAndUpdate({ _id: user._id }, {
        isEmailVerified: true, $unset: {
            confirm_otp: "",
            confirm_otp_exp_time: ""
        }
    });
    res.status(200).json({ message: "email verified successfully" });
}

// login service
export const loginService = async (req, res, next) => {
    const { email, password } = req.body;
    // find email in database
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "invalied email or password" })
    const userPassword = await secure.comparing(password, user.password)
    if (!userPassword) return res.status(401).json({ message: "invalied email or password" })
    // generate access token for user _id and email
    const accesstoken = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '30m', jwtid: uuidv4() })
    // generate refresh token from access token
    const refreshtoken = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '7d', jwtid: uuidv4() })
    res.status(200).json({ message: "Login successfully", accesstoken, refreshtoken });
}

// refresh token services 
export const refreshTokenService = async (req, res, next) => {
    const { refreshtoken } = req.headers;
    const decodedRefreshToken = jwt.verify(refreshtoken, process.env.JWT_REFRESH_TOKEN)
    const isRefreshTokenBlacklisted = await BlackListTokensModel.findOne({ tokenId: decodedRefreshToken.jti });
    if (isRefreshTokenBlacklisted) { return res.status(400).json({ message: "Token already blacklisted" }) }
    const decodedData = jwt.verify(refreshtoken, process.env.JWT_REFRESH_TOKEN)
    // generate access token from refresh token data
    const accesstoken = jwt.sign({ _id: decodedData._id, email: decodedData.email }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '30m', jwtid: uuidv4() })
    res.status(200).json({ message: "Token refershed successfully", accesstoken });
}

// Logout service
export const logoutService = async (req, res, next) => {
    const { tokenId, expiryDate } = req.authUser.token;
    const { refreshtoken } = req.headers
    const decodedRefreshToken = jwt.verify(refreshtoken, process.env.JWT_REFRESH_TOKEN)
    const existingTokens = await BlackListTokensModel.find({
        tokenId: { $in: [tokenId, decodedRefreshToken.jti] }
    });
    console.log(existingTokens)
    if (existingTokens.length > 0) {
        return res.status(400).json({ message: "Token already blacklisted" });
    }
    await BlackListTokensModel.insertMany([
        { tokenId, expiryDate }, { tokenId: decodedRefreshToken.jti, expiryDate: decodedRefreshToken.exp }
    ]);
    res.status(200).json({ message: "User logged out successfully" });
}

// forget password service
export const forgetPasswordService = async (req, res, next) => {
    const { email } = req.body
    const user = await UserModel.findOne({ email })
    if (!user) return res.status(404).json({ message: "user not found" })
    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiration = new Date()
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10)
    // send verification email with OTP
    emitter.emit('sendEmail', {
        subject: "Your OTP code",
        to: email,
        html: forgetPassEmailTemp(email, otp)
    })
    const hashedOtp = await secure.hashing(otp, +process.env.SALT)
    user.forget_otp = hashedOtp
    user.confirm_otp_exp_time = otpExpiration
    await user.save()
    res.status(202).json({ message: "OTP sented successfully, check yor email inbox" })
}

// reset password 
export const resetPasswordService = async (req, res) => {
    const { email, otp, password, confirmPassword } = req.body;
    const user = await UserModel.findOne({ email })
    if (!user)
        return res.status(404).json({ message: "user not found" })
    if (!user.confirm_otp_exp_time || new Date() > user.confirm_otp_exp_time)
        return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    const isOtp = await secure.comparing(otp, user.forget_otp)
    if (!isOtp)
        return res.status(401).json({ message: "otp invalied" })
    const hashedPassword = await secure.hashing(password, +process.env.SALT)
    await UserModel.findByIdAndUpdate({ _id: user._id }, { password: hashedPassword, $unset: { forget_otp: "", confirm_otp_exp_time: "" } })
    res.status(202).json({ message: "password updated successfully, please login with new password" })
}