import axios from 'axios';
const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data)
};

export const complaintAPI = {
  create: (data) => API.post('/complaints', data),
  getMy: () => API.get('/complaints/my'),
  getById: (id) => API.get(`/complaints/${id}`)
};

export const dashboardAPI = {
  stats: () => API.get('/dashboard/stats'),
  analytics: () => API.get('/dashboard/analytics')
};

export const paymentAPI = {
  createOrder: (data) => API.post('/payment/order', data),
  verify: (data) => API.post('/payment/verify', data)
};

export default API;
