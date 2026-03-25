import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authentification et obtention d'un JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', rateLimiter, async (req, res) => {
  const { username, password } = req.body;
console.log('Login attempt:', { username, password });
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminUsername || !adminPasswordHash) {
    console.error('Admin credentials not set in environment variables');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  // Vérifier le nom d'utilisateur et le mot de passe (comparaison avec bcrypt)
  if (username === adminUsername && bcrypt.compareSync(password, adminPasswordHash)) {
    const token = jwt.sign(
      { id: 'admin', role: 'admin' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion (invalide le token côté client)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out' });
});
export default router;