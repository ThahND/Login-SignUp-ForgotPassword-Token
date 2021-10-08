
const Joi = require('@hapi/joi');

// Forgot Password Validate
const forgotPasswordValidation = (data) => {
    const schema = Joi.object({
        password: Joi.string()
            .min(1)
            .required(),
        repeat: Joi.string()
            .min(1)
            .required(),
    })
    return schema.validate(data)
}

module.exports = { forgotPasswordValidation }