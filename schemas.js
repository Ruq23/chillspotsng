const Joi = require('joi')

module.exports.spotSchema = Joi.object({
    spot: Joi.object({
        name: Joi.string().required(),
        about: Joi.string().required(),
        location: Joi.string().required(),
        address: Joi.string().required(),
        // image: Joi.string().required(),
        price: Joi.number().required().min(0),
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        name: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

