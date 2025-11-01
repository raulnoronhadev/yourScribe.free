import type { AxiosError } from 'axios';

export const errorInterceptor = (error: AxiosError) => {
    const errorMessage = error.response
      ? `API Error: ${error.response.data}` : error.request
      ? `Network Error: ${error.message}` : `Request Error: ${error.message}`;
    console.error(errorMessage);
    return Promise.reject(error);
}