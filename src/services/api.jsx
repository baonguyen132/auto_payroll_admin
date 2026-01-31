const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...(token && { 'Authorization' : `Bearer ${token}`}),
    };
}
export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://steady-sharply-ibex.ngrok-free.app/"
export const API_BASE_URL = BASE_URL + "api";
export const API_URL_IMAGE = import.meta.env.VITE_API_URL_IMAGE || "https://182013707c82.ngrok-free.app/"; 

export default getAuthHeaders;