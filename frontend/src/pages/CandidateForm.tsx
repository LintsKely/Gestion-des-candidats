import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  createCandidate,
  updateCandidate,
  getCandidateById,
} from '../api/candidates';
import type { CreateCandidateDto } from '../types';
import { candidateSchema } from '../utils/validationSchemas';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// =======================
// Utils (clean & séparé)
// =======================

const normalizePhone = (value: string): string =>
  value.replace(/[\s.-]/g, '');

const formatPhone = (value: string): string => {
  if (!value) return '';

  if (value.startsWith('+33')) {
    const rest = value.slice(3);
    return '+33 ' + (rest.match(/.{1,2}/g)?.join(' ') || '');
  }

  if (value.startsWith('0')) {
    const rest = value.slice(1);
    return '0' + (rest.match(/.{1,2}/g)?.join(' ') || '');
  }

  return value;
};

const filterPhoneInput = (value: string): string =>
  value.replace(/[^0-9+\s.-]/g, '');

const toLowerEmail = (value: string): string =>
  value.toLowerCase();

// =======================
// Component
// =======================

const CandidateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState<string | null>(null);
  const [localPhone, setLocalPhone] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateCandidateDto>({
    resolver: joiResolver(candidateSchema),
    mode: 'onChange',
  });

  const phoneValue = watch('phone');

  // Sync affichage téléphone
  useEffect(() => {
    setLocalPhone(formatPhone(phoneValue || ''));
  }, [phoneValue]);

  // Chargement édition
  useEffect(() => {
    if (!id) return;

    getCandidateById(id)
      .then((candidate) => {
        setValue('firstName', candidate.firstName);
        setValue('lastName', candidate.lastName);
        setValue('email', candidate.email);
        setValue('phone', candidate.phone);
        setValue('position', candidate.position);
      })
      .catch(() => setApiError('Erreur chargement candidat'));
  }, [id, setValue]);

  // =======================
  // Handlers
  // =======================

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = filterPhoneInput(e.target.value);

    setLocalPhone(raw);

    setValue('phone', normalizePhone(raw), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handlePhoneBlur = () => {
    setLocalPhone(formatPhone(localPhone));
  };

  const onSubmit = async (data: CreateCandidateDto) => {
    try {
      setApiError(null);

      if (id) {
        await updateCandidate(id, data);
      } else {
        await createCandidate(data);
      }

      navigate('/');
    } catch (err: unknown) {
      const error = err as ApiError;
      setApiError(
        error.response?.data?.message || 'Erreur serveur'
      );
    }
  };

  // =======================
  // UI classes (cohérent avec thème marine)
  // =======================

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-marine';
  const labelClass = 'block text-gray-700 mb-1';
  const errorClass = 'text-red-700 text-xs mt-1';

  // =======================
  // Render
  // =======================

  return (
    <div className="bg-marine min-h-screen p-6">
      <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {id ? 'Modifier le candidat' : 'Créer un candidat'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className={labelClass}>Prénom *</label>
            <input
              id="firstName"
              {...register('firstName')}
              placeholder="Jean-Luc"
              className={inputClass}
            />
            {errors.firstName && (
              <p className={errorClass}>{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className={labelClass}>Nom *</label>
            <input
              id="lastName"
              {...register('lastName')}
              placeholder="Dupont"
              className={inputClass}
            />
            {errors.lastName && (
              <p className={errorClass}>{errors.lastName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>Email *</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                onChange: (e) =>
                  setValue(
                    'email',
                    toLowerEmail(e.target.value),
                    { shouldValidate: true }
                  ),
              })}
              placeholder="jean.dupont@example.com"
              className={inputClass}
            />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClass}>Téléphone</label>
            <input
              id="phone"
              type="tel"
              value={localPhone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              placeholder="06 12 34 56 78 ou +33 6 12 34 56 78"
              className={inputClass}
            />
            {errors.phone && (
              <p className={errorClass}>{errors.phone.message}</p>
            )}
          </div>

          {/* Position */}
          <div>
            <label htmlFor="position" className={labelClass}>Poste *</label>
            <input
              id="position"
              {...register('position')}
              placeholder="Développeur Full Stack"
              className={inputClass}
            />
            {errors.position && (
              <p className={errorClass}>{errors.position.message}</p>
            )}
          </div>

          {/* API Error */}
          {apiError && (
            <p className="text-red-700 text-xs mt-2">{apiError}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-marine text-white rounded hover:bg-opacity-90 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Enregistrement...'
                : id
                ? 'Mettre à jour'
                : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm;