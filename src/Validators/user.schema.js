import Joi from "joi";

export const updateProfileValidation = {
    body: Joi.object({
        username: Joi.string().min(3).max(30).optional(),
        email: Joi.string().email().optional(),
        phone: Joi.string().pattern(/^\d{10,15}$/).optional(),
        DOB: Joi.date().iso().optional()
    }).min(1)
} 