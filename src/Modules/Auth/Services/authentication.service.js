import UserModel from "../../../DB/Models/user.model.js"
import { emitter } from "../../../Services/sending-email.service.js";
import * as secure from "../../../Utils/crypto.js";
import emailTemplate from "../../../Utils/email-temp.js";
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid";

// Signup service
export const signupService = async (req, res, next) => {

    const { username, phone, fullName, email, password, confirmPassword, gender, age, location, bio, privateAccount } = req.body

    // combare password and confirmed password 
    if (password !== confirmPassword) return res.status(400).json({ message: "Dosn't match" });

    // check email uniquness
    const isEmailExist = await UserModel.findOne({ email })
    if (isEmailExist) return res.status(404).json({ message: "email already exist" })

    // check user name uniquness
    const isUserNameExist = await UserModel.findOne({ username })
    if (isUserNameExist) return res.status(404).json({ message: "user name already exist" })

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
    const hashedOtp = secure.hashing(otp, +process.env.SALT)

    // send verification email with OTP
    emitter.emit('sendEmail', {
        subject: "Your OTP code",
        to: email,
        html: emailTemplate(username, otp)
    })

    // create user account
    const user = new UserModel({
        username,
        email,
        password: hashedPassword,
        phone: encryptedPhone,
        confirm_otp: hashedOtp,
        full_name: fullName,
        confirm_otp_exp_time: otpExpiration,
        gender, age, location, bio, isPublic
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
    const decodedData = jwt.verify(refreshtoken, process.env.JWT_REFRESH_TOKEN)
    // generate access token from refresh token data
    const accesstoken = jwt.sign({ _id: decodedData._id, email: decodedData.email }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '30m', jwtid: uuidv4() })
    res.status(200).json({ message: "Token refershed successfully", accesstoken });
}