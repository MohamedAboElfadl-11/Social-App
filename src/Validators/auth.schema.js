import Joi from 'joi'

export const signupValidation = {
    body: Joi.object({
        username: Joi.string().alphanum().min(3).max(20).required()
            .messages({
                "string.empty": "Username is required",
                "string.alphanum": "Username must contain only letters and numbers",
                "string.min": "Username must be at least 3 characters",
                "string.max": "Username must be at most 20 characters"
            }),
        phone: Joi.string().pattern(/^\d{10,15}$/).required()
            .messages({
                "string.empty": "Phone number is required",
                "string.pattern.base": "Phone number must be between 10 and 15 digits"
            }),
        fullName: Joi.string().min(3).max(50).required()
            .messages({
                "string.empty": "Full name is required",
                "string.min": "Full name must be at least 3 characters",
                "string.max": "Full name must be at most 50 characters"
            }),
        email: Joi.string().email().required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Invalid email format"
            }),
        password: Joi.string().min(8).max(30).required().pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/
        ).messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password must be at most 30 characters"
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
            .messages({
                "any.only": "Passwords do not match",
                "string.empty": "Confirm password is required"
            }),
        gender: Joi.string().valid('Male', 'Female', 'N/A').required()
            .messages({
                "string.empty": "Gender is required",
                "any.only": "Gender must be 'Male', 'Female' or 'N/A'"
            }),
        DOB: Joi.date().iso().max("now").min(new Date(new Date().setFullYear(new Date().getFullYear() - 100))).required(),

        location: Joi.string().min(3).max(100).required()
            .messages({
                "string.empty": "Location is required",
                "string.min": "Location must be at least 3 characters",
                "string.max": "Location must be at most 100 characters"
            }),
        bio: Joi.string().max(30).allow("").optional()
            .messages({
                "string.max": "Bio must be at most 200 characters"
            }),
        privateAccount: Joi.boolean()
    })
}

export const verifyEmailValidation = {
    body: Joi.object({
        email: Joi.string().email().required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Invalid email format"
            }),
        otp: Joi.string().length(6).pattern(/^\d+$/).required()
            .messages({
                "string.empty": "OTP is required",
                "string.length": "OTP must be exactly 6 digits",
                "string.pattern.base": "OTP must contain only numbers"
            }),
    })
}

export const forgetPasswordValidation = {
    body: Joi.object({
        email: Joi.string().email().required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Invalid email format"
            }),
    })
}

export const resetPasswordValidation = {
    body: Joi.object({
        email: Joi.string().email().required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Invalid email format"
            }),
        otp: Joi.string().length(6).pattern(/^\d+$/).required()
            .messages({
                "string.empty": "OTP is required",
                "string.length": "OTP must be exactly 6 digits",
                "string.pattern.base": "OTP must contain only numbers"
            }),
        password: Joi.string().min(8).max(30).required().pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/
        ).messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password must be at most 30 characters"
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
            .messages({
                "any.only": "Passwords do not match",
                "string.empty": "Confirm password is required"
            }),
    })
}

export const updatePasswordValidation = {
    body: Joi.object({
        oldPassword: Joi.string().min(8).max(30).required().pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/
        ).messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password must be at most 30 characters"
        }),
        password: Joi.string().min(8).max(30).required().pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/
        ).messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password must be at most 30 characters"
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
            .messages({
                "any.only": "Passwords do not match",
                "string.empty": "Confirm password is required"
            }),
    })
}
