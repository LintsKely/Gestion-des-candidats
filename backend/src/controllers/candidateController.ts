import { Request, Response } from 'express';
import Candidate from '../models/Candidate';
import { candidateSchema, updateCandidateSchema } from '../utils/validation';
import logger from '../utils/logger';

export const createCandidate = async (req: Request, res: Response) => {
  try {
    const { error, value } = candidateSchema.validate(req.body);
    if (error) {
      logger.warn(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({ message: error.details[0].message });
    }

    const candidate = new Candidate(value);
    await candidate.save();
    logger.info(`Candidate created: ${candidate._id}`);
    res.status(201).json(candidate);
  } catch (err: any) {
    if (err.code === 11000) {
      logger.warn(`Duplicate email: ${req.body.email}`);
      return res.status(409).json({ message: 'Email already exists' });
    }
    logger.error(`Create candidate error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

export const getCandidate = async (req: Request, res: Response) => {
  try {
    const candidate = await Candidate.findOne({ _id: req.params.id, deletedAt: null });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err: any) {
    logger.error(`Get candidate error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

export const listCandidates = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { deletedAt: null };
    if (req.query.search) {
      const search = req.query.search as string;
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }
    if (req.query.position) filter.position = { $regex: req.query.position, $options: 'i' };
    if (req.query.status) filter.status = req.query.status;

    const [candidates, total] = await Promise.all([
      Candidate.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Candidate.countDocuments(filter)
    ]);

    res.json({
      candidates,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    });
  } catch (err: any) {
    logger.error(`List candidates error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

export const updateCandidate = async (req: Request, res: Response) => {
  try {
    // Utiliser le schéma de mise à jour (tous champs optionnels)
    const { error, value } = updateCandidateSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      logger.warn(`Update validation error: ${error.details[0].message}`);
      return res.status(400).json({ message: error.details[0].message });
    }

    const candidate = await Candidate.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      value,
      { returnDocument: 'after', runValidators: true }
    );
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    logger.info(`Candidate updated: ${candidate._id}`);
    res.json(candidate);
  } catch (err: any) {
    if (err.code === 11000) {
      logger.warn(`Duplicate email on update: ${req.body.email}`);
      return res.status(409).json({ message: 'Email already exists' });
    }
    logger.error(`Update candidate error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

export const softDeleteCandidate = async (req: Request, res: Response) => {
  try {
    const candidate = await Candidate.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { deletedAt: new Date() },
      { returnDocument: 'after' }
    );
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    logger.info(`Candidate deleted (soft): ${candidate._id}`);
    res.json({ message: 'Candidate deleted' });
  } catch (err: any) {
    logger.error(`Delete candidate error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

export const validateCandidate = async (req: Request, res: Response) => {
  try {
    const candidate = await Candidate.findOne({ _id: req.params.id, deletedAt: null });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    // Simulation de délai asynchrone (2s)
    await new Promise(resolve => setTimeout(resolve, 2000));

    candidate.status = 'validated';
    await candidate.save();
    logger.info(`Candidate validated: ${candidate._id}`);
    res.json({ message: 'Candidate validated', candidate });
  } catch (err: any) {
    logger.error(`Validate candidate error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};