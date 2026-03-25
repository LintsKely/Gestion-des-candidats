import { Router } from 'express';
import {
  createCandidate,
  getCandidate,
  updateCandidate,
  softDeleteCandidate,
  validateCandidate,
  listCandidates
} from '../controllers/candidateController';
import { authMiddleware } from '../middlewares/auth';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Candidates
 *   description: Gestion des candidats
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/candidates:
 *   post:
 *     summary: Créer un nouveau candidat
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCandidateDto'
 *     responses:
 *       201:
 *         description: Candidat créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', rateLimiter, createCandidate);


/**
 * @swagger
 * /api/candidates:
 *   get:
 *     summary: Liste paginée des candidats (avec filtres)
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: Filtrer par prénom (recherche partielle)
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Filtrer par nom (recherche partielle)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrer par email (recherche partielle)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, validated, rejected]
 *         description: Filtrer par statut
 *     responses:
 *       200:
 *         description: Liste paginée des candidats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 candidates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Candidate'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       401:
 *         description: Non authentifié
 */
router.get('/', listCandidates);   

/**
 * @swagger
 * /api/candidates/{id}:
 *   get:
 *     summary: Récupérer un candidat par son ID
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du candidat
 *     responses:
 *       200:
 *         description: Détails du candidat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       404:
 *         description: Candidat non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getCandidate);

/**
 * @swagger
 * /api/candidates/{id}:
 *   put:
 *     summary: Mettre à jour un candidat
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du candidat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCandidateDto'
 *     responses:
 *       200:
 *         description: Candidat mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Candidat non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', updateCandidate);

/**
 * @swagger
 * /api/candidates/{id}:
 *   delete:
 *     summary: Supprimer un candidat (soft delete)
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du candidat
 *     responses:
 *       200:
 *         description: Candidat supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Candidat non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', softDeleteCandidate);

/**
 * @swagger
 * /api/candidates/{id}/validate:
 *   post:
 *     summary: Valider un candidat (simulation asynchrone 2s)
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du candidat
 *     responses:
 *       200:
 *         description: Candidat validé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 candidate:
 *                   $ref: '#/components/schemas/Candidate'
 *       404:
 *         description: Candidat non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/validate', validateCandidate);

export default router;