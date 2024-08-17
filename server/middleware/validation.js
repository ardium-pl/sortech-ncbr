import Joi from 'joi';

const pacjentSchema = Joi.object({
    imie: Joi.string().required(),
    nazwisko: Joi.string().required(),
    pesel: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
    stan: Joi.string().valid('krytyczny', 'poważny', 'stabilny', 'wypisany').required(),
    priorytet: Joi.number().integer().min(1).max(5).required()
});

export const validatePacjent = (req, res, next) => {
    const {error} = pacjentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    next();
};