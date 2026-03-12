import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const bookApi = {
    getAll: () => api.get('/books'),
    getById: (id) => api.get(`/books/${id}`),
    search: (keyword) => api.get(`/books/search?keyword=${keyword}`),
    getAvailable: () => api.get('/books/available'),
    getByCategory: (categoryId) => api.get(`/books/category/${categoryId}`),
    create: (book) => api.post('/books', book),
    update: (id, book) => api.put(`/books/${id}`, book),
    delete: (id) => api.delete(`/books/${id}`),
};

export const userApi = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    search: (name) => api.get(`/users/search?name=${name}`),
    create: (user) => api.post('/users', user),
    update: (id, user) => api.put(`/users/${id}`, user),
    delete: (id) => api.delete(`/users/${id}`),
    login: (email, password) => api.post('/users/login', { email, password }),
    resetPassword: (email, newPassword) => api.post('/users/reset-password', { email, password: newPassword }),
};

export const loanApi = {
    getAll: () => api.get('/loans'),
    getById: (id) => api.get(`/loans/${id}`),
    getByUser: (userId) => api.get(`/loans/user/${userId}`),
    getActive: () => api.get('/loans/active'),
    getOverdue: () => api.get('/loans/overdue'),
    checkout: (bookId, userId) => api.post(`/loans/checkout?bookId=${bookId}&userId=${userId}`),
    return: (id) => api.post(`/loans/${id}/return`),
    extend: (id, days) => api.post(`/loans/${id}/extend?days=${days}`),
};

export const categoryApi = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`),
    create: (category) => api.post('/categories', category),
    update: (id, category) => api.put(`/categories/${id}`, category),
    delete: (id) => api.delete(`/categories/${id}`),
};

export default api;
