import axios from 'axios';
const api = axios.create({ baseURL: '/api', withCredentials: true });
export const errorMessage = (error) =>
  error.response?.data?.message || 'Unable to connect. Please try again.';
export const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
export default api;
