const Joi = require("joi"); // Inkludera joi för validering 

// Sätt validering för användare 
const userValidation = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(5).max(30).required()
});

// Exportera objekt 
module.exports = { userValidation };