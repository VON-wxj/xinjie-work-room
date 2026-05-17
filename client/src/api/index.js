import axios from 'axios';

const isDev = import.meta.env.DEV;
const baseURL = isDev ? '/api' : `http://${window.location.hostname}:3003/api`;

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data).then(r => r.data),
  register: (data) => api.post('/auth/register', data).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
};

// Activities
export const activityAPI = {
  list: (params) => api.get('/activities', { params }).then(r => r.data),
  adminList: (params) => api.get('/activities/admin', { params }).then(r => r.data),
  get: (id) => api.get(`/activities/${id}`).then(r => r.data),
  create: (data) => api.post('/activities', data).then(r => r.data),
  update: (id, data) => api.put(`/activities/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/activities/${id}`).then(r => r.data),
  // Photos
  getPhotos: (id) => api.get(`/activities/${id}/photos`).then(r => r.data),
  uploadPhotos: (id, formData) => api.post(`/activities/${id}/photos`, formData).then(r => r.data),
  deletePhoto: (id, photoId) => api.delete(`/activities/${id}/photos/${photoId}`).then(r => r.data),
  // Attachments
  getAttachments: (id) => api.get(`/activities/${id}/attachments`).then(r => r.data),
  uploadAttachments: (id, formData) => api.post(`/activities/${id}/attachments`, formData).then(r => r.data),
  deleteAttachment: (id, attId) => api.delete(`/activities/${id}/attachments/${attId}`).then(r => r.data),
};

// Categories
export const categoryAPI = {
  list: (params) => api.get('/categories', { params }).then(r => r.data),
  create: (data) => api.post('/categories', data).then(r => r.data),
  update: (id, data) => api.put(`/categories/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/categories/${id}`).then(r => r.data),
};

// Comments
export const commentAPI = {
  list: (activityId) => api.get(`/comments/activity/${activityId}`).then(r => r.data),
  all: (params) => api.get('/comments/all', { params }).then(r => r.data),
  create: (activityId, data) => api.post(`/comments/activity/${activityId}`, data).then(r => r.data),
  delete: (id) => api.delete(`/comments/${id}`).then(r => r.data),
  updateStatus: (id, data) => api.put(`/comments/${id}/status`, data).then(r => r.data),
};

// Favorites
export const favoriteAPI = {
  list: () => api.get('/favorites').then(r => r.data),
  toggle: (activityId) => api.post(`/favorites/${activityId}`).then(r => r.data),
  check: (activityId) => api.get(`/favorites/check/${activityId}`).then(r => r.data),
};

// Users
export const userAPI = {
  list: (params) => api.get('/users', { params }).then(r => r.data),
  visitors: (params) => api.get('/users/visitors', { params }).then(r => r.data),
  createAdmin: (data) => api.post('/users/admin', data).then(r => r.data),
  update: (id, data) => api.put(`/users/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/users/${id}`).then(r => r.data),
};

// Upload
export const uploadAPI = {
  image: (formData) => api.post('/upload/image', formData).then(r => r.data),
  file: (formData) => api.post('/upload/file', formData).then(r => r.data),
};

// Logs
export const logAPI = {
  list: (params) => api.get('/logs', { params }).then(r => r.data),
};

// Settings
export const settingsAPI = {
  get: () => api.get('/settings').then(r => r.data),
  update: (data) => api.put('/settings', data).then(r => r.data),
};

// Team
export const teamAPI = {
  list: () => api.get('/team').then(r => r.data),
  get: (id) => api.get(`/team/${id}`).then(r => r.data),
  create: (data) => api.post('/team', data).then(r => r.data),
  update: (id, data) => api.put(`/team/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/team/${id}`).then(r => r.data),
};

// Projects
export const projectAPI = {
  list: () => api.get('/projects').then(r => r.data),
  get: (id) => api.get(`/projects/${id}`).then(r => r.data),
  adminList: () => api.get('/projects/admin/all').then(r => r.data),
  create: (data) => api.post('/projects', data).then(r => r.data),
  update: (id, data) => api.put(`/projects/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/projects/${id}`).then(r => r.data),
};

// Profile
export const profileAPI = {
  get: () => api.get('/profile').then(r => r.data),
  update: (data) => api.put('/profile', data).then(r => r.data),
};

// Timeline
export const timelineAPI = {
  list: () => api.get('/timeline').then(r => r.data),
  create: (data) => api.post('/timeline', data).then(r => r.data),
  update: (id, data) => api.put(`/timeline/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/timeline/${id}`).then(r => r.data),
};

export default api;
