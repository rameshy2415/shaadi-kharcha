// Frontend API Service (services/api.js)
import axios from 'axios';
import config from '../config/config';

// Create axios instance with default headers
const api = axios.create({
  baseURL: config.BACKEND_API,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: userData => api.post('/auth/register', userData),
  login: userData => api.post('/auth/login', userData),
  getCurrentUser: () => api.get('/auth/user')
};

// Expenses API calls
export const expenseAPI = {
  getExpenses: () => api.get('/expenses'),
  addExpense: expenseData => api.post('/expenses', expenseData),
  updateExpense: (id, expenseData) => api.put(`/expenses/${id}`, expenseData),
  deleteExpense: id => api.delete(`/expenses/${id}`)
};

// Receive money API calls
export const receiveMoneyAPI = {
  getReceivedMoney: () => api.get('/receivemoney'),
  addReceivedMoney: receiveMoneyData => api.post('/receivemoney', receiveMoneyData),
  updateReceivedMoney: (id, receiveMoneyData) => api.put(`/receivemoney/${id}`, receiveMoneyData),
  deleteReceivedMoney: id => api.delete(`/receivemoney/${id}`)
};

export default api;
