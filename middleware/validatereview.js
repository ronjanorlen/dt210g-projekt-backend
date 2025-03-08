const Joi = require("joi"); // Inkludera joi för validering 

// Sätt validering för recesioner 
const reviewValidation = Joi.object({
    bookId: Joi.string().required(),
    userId: Joi.string().required(),
    bookTitle: Joi.string().required(),
    username: Joi.string().required(),
    reviewText: Joi.string().min(1).max(500).required(),
    rating: Joi.number().integer().min(1).max(5).required()
});

// Exportera objekt 
module.exports = { reviewValidation }; 