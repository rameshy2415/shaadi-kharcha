// Frontend API Service (services/api.js)
import axios from 'axios';

// Create axios instance with default headers
// UAT url:  baseURL: 'https://shaadi-kharcha-service.onrender.com/api'
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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

export default api;