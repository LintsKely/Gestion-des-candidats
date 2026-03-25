export interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  status: 'pending' | 'validated' | 'rejected';
  createdAt: string;
  updatedAt: string;
}


export interface CandidateFilters {
  search?: string;      // recherche combinée (nom/prénom)
  position?: string;    // filtre sur le poste
  status?: 'pending' | 'validated' | 'rejected' | '';
}

export type CreateCandidateDto = Omit<Candidate, '_id' | 'status' | 'createdAt' | 'updatedAt'>;
export type UpdateCandidateDto = Partial<CreateCandidateDto> & { status?: Candidate['status'] };