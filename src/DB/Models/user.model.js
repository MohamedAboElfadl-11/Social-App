import mongoose from "mongoose";
import { providers, systemRoles } from "../../Constants/constatnts.js";
import { encryption, hashing } from "../../Utils/crypto.js";

const userModelSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        full_name: {
            type: String,
            // required: true,
        },
        gender: {
            type: String,
            //  required: true,
            default: "N/A",
            enum: ['Male', 'Female', 'N/A']
        },
        DOB: {
            type: Date,
            // required: true
        },
        location: {
            type: String,
            // required: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            default: systemRoles.USER,
            enum: Object.values(systemRoles),
        },
        isDeactivated: {
            type: Boolean,
            default: false,
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
        provider: {
            type: String,
            default: providers.SYSTEM,
            enum: Object.values(providers)
        },
        age: Number,

        phone: String,

        confirm_otp: String,

        confirm_otp_exp_time: Date,

        forget_otp: String,

        profile_picture: String,

        cover_picture: String,

        bio: String,
    },
    {
        timestamps: true

    }
)

userModelSchema.pre('save', async function (next) {
    if (this.isModified('password')) this.password = hashing(this.password, +process.env.SALT)
    if (this.isModified('confirm_otp')) this.confirm_otp = hashing(this.confirm_otp, +process.env.SALT)
    if (this.isModified('phone')) this.phone = encryption(this.phone, process.env.SECRET_KEY)
    next()
})


const UserModel = mongoose.models.users || mongoose.model('users', userModelSchema)

export default UserModel