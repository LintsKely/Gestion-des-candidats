import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  status: 'pending' | 'validated' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const CandidateSchema = new Schema<ICandidate>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true},
  phone: { type: String },
  position: { type: String, required: true },
  status: { type: String, enum: ['pending', 'validated', 'rejected'], default: 'pending' },
  deletedAt: { type: Date, default: null }
}, { timestamps: true });

CandidateSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { deletedAt: { $eq: null } } }
);

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);