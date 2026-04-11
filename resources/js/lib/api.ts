import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_URL ? `${import.meta.env.VITE_APP_URL}/api` : 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false,
});

// Add interceptor to attach bearer token if needed
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
