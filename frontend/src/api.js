import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const donorService = {
  getDonors: () => api.get('/donors'),
  createDonor: (data) => api.post('/donors', data),
};

export const recipientService = {
  getRecipients: () => api.get('/recipients'),
  createRecipient: (data) => api.post('/recipients', data),
};

export const requestService = {
  getRequests: () => api.get('/requests'),
  createRequest: (data) => api.post('/requests', data),
  getMatches: (id) => api.get(`/match/${id}`),
};

export const driveService = {
  getDrives: () => api.get('/drives'),
};

export default api;
