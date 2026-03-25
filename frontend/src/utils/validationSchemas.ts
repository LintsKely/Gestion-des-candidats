import Joi from 'joi';

const namePattern = /^[A-Z][a-zÀ-ÿ]*(?:[- ][A-Z][a-zÀ-ÿ]*)?$/;

export const candidateSchema = Joi.object({
  firstName: Joi.string()
    .pattern(namePattern)
    .required()
    .messages({
      'string.pattern.base':
        'Prénom : première lettre majuscule, uniquement des lettres.',
      'any.required': 'Prénom requis.',
    }),

  lastName: Joi.string()
    .pattern(namePattern)
    .required()
    .messages({
      'string.pattern.base':
        'Nom : première lettre majuscule, uniquement des lettres.',
      'any.required': 'Nom requis.',
    }),

  email: Joi.string().email().required().messages({
    'string.email': 'Email invalide.',
    'any.required': 'Email requis.',
  }),

  phone: Joi.string()
    .custom((value, helpers) => {
      if (!value) return value;

      // 🔥 NORMALISATION (clé de la solution)
      const cleaned = value.replace(/[\s.-]/g, '');

      const regex = /^(0[1-9][0-9]{8})$|^(\+33[1-9][0-9]{8})$/;

      if (!regex.test(cleaned)) {
        return helpers.error('any.invalid');
      }

      return cleaned; // 👉 IMPORTANT : on retourne le format CLEAN
    })
    .optional()
    .messages({
      'any.invalid':
        'Numéro invalide (ex: 0612345678 ou +33612345678)',
    }),

  position: Joi.string().required().messages({
    'any.required': 'Poste requis.',
  }),
});