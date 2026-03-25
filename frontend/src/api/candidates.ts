import type { CandidateFilters, CreateCandidateDto, UpdateCandidateDto } from '../types';
import apiClient from './client';

export const getCandidates = async (
  page = 1,
  limit = 10,
  filters?: CandidateFilters
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (filters?.search) params.append('search', filters.search);
  if (filters?.position) params.append('position', filters.position);
  if (filters?.status) params.append('status', filters.status);
  const response = await apiClient.get(`/api/candidates?${params}`);
  return response.data;
};

export const getCandidateById = async (id: string) => {
  const response = await apiClient.get(`/api/candidates/${id}`);
  return response.data;
};

export const createCandidate = async (data: CreateCandidateDto) => {
  const response = await apiClient.post('/api/candidates', data);
  return response.data;
};

export const updateCandidate = async (id: string, data: UpdateCandidateDto) => {
  const response = await apiClient.put(`/api/candidates/${id}`, data);
  return response.data;
};

export const deleteCandidate = async (id: string) => {
  const response = await apiClient.delete(`/api/candidates/${id}`);
  return response.data;
};

export const validateCandidate = async (id: string) => {
  const response = await apiClient.post(`/api/candidates/${id}/validate`);
  return response.data;
};