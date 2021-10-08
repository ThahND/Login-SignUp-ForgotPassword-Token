
const Joi = require('@hapi/joi');

// Create New Validate
const createValidation = (data) => {
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
        accounttype: Joi.string()
            .min(1)
            .required()
    })
    return schema.validate(data)
}


module.exports = { createValidation }
