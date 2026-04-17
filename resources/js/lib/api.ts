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

// Add interceptor to handle 401 responses globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            // Allow components to handle their own UX or fallback to login
        }

        return Promise.reject(error);
    }
);

export default api;
