
const Joi = require('@hapi/joi');


// Login Validate
const loginValidation = (dataJson) => {
    const schema = Joi.object({
        email: Joi.string()
            //.email()
            .min(1)
            .max(50)
            .trim()
            .required(),
        password: Joi.string()
            .min(1)
            .max(50)
            .trim()
            .required(),
    })
    return schema.validate(dataJson)
}


module.exports = { loginValidation }
