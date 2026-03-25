import apiClient from './client';

export const login = async (username: string, password: string) => {
  console.log('Login attempt', { username, password });
  const response = await apiClient.post('/auth/login', { username, password });
   console.log('Login response', response);
  const { token } = response.data;
  localStorage.setItem('token', token);
  return token;
};

export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error', error);
  } finally {
    localStorage.removeItem('token');
  }
};