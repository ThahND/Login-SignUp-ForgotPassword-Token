
const Joi = require('@hapi/joi');


const changePasswordValidation = (data) => {
    const schema = Joi.object({
        oldPassword: Joi.string()
            .min(1)
            .required(),
        newPassword: Joi.string()
            .min(1)
            .required(),
        repeatPassword: Joi.string()
            .min(1)
            .required()
    })
    return schema.validate(data)
}


module.exports = { changePasswordValidation }
