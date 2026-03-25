import Joi from 'joi';

// Regex pour les noms/prénoms : commence par une majuscule, suivie de lettres (accentuées incluses)
// autorise un espace ou un tiret pour les noms composés, avec majuscule après
const namePattern = /^[A-Z][a-zÀ-ÿ]*(?:[- ][A-Z][a-zÀ-ÿ]*)?$/;

export const candidateSchema = Joi.object({
  firstName: Joi.string()
    .pattern(namePattern)
    .required()
    .messages({
      'string.pattern.base': 'Prénom : première lettre majuscule, uniquement des lettres (pas de chiffres ni caractères spéciaux).',
      'any.required': 'Prénom requis.',
    }),
  lastName: Joi.string()
    .pattern(namePattern)
    .required()
    .messages({
      'string.pattern.base': 'Nom : première lettre majuscule, uniquement des lettres (pas de chiffres ni caractères spéciaux).',
      'any.required': 'Nom requis.',
    }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email invalide.',
    'any.required': 'Email requis.',
  }),
  phone: Joi.string()
    .pattern(/^(?:(?:\+|00)33|0)[1-9](?:[\s.-]?\d{2}){4}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Numéro de téléphone français invalide (ex: 0612345678, 06 12 34 56 78, +33612345678)',
    }),
  position: Joi.string().required().messages({
    'any.required': 'Poste requis.',
  }),
});

export const updateCandidateSchema = Joi.object({
  firstName: Joi.string().pattern(namePattern).optional(),
  lastName: Joi.string().pattern(namePattern).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^(?:(?:\+|00)33|0)[1-9](?:[\s.-]?\d{2}){4}$/)
    .optional(),
  position: Joi.string().optional(),
  status: Joi.string().valid('pending', 'validated', 'rejected').optional(),
});