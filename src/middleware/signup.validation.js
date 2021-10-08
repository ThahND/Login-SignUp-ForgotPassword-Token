
const Joi = require('@hapi/joi');

// Register Validate
const signupValidation = (data) => {
    const schema = Joi.object({
        firstname: Joi.string()
            .min(1)
            .required(),
        lastname: Joi.string()
            .min(1)
            .required(),
        email: Joi.string()
            //.email()
            .min(1)
            .required(),
        password: Joi.string()
            .min(1)
            .required(),
        repeatPassword: Joi.string()
            .min(1)
            .required()
    })
    return schema.validate(data)
}


module.exports = { signupValidation }
