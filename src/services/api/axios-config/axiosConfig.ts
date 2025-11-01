import { responseInterceptor } from './interceptors/ResponseInterceptor';
import { errorInterceptor } from './interceptors/ErrorInterceptor';

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    timeout: 1800000, // 30 minutes
})

api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error),
);

export default api;