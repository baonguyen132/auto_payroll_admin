import getAuthHeaders, { API_BASE_URL } from '../api';

// Helper xử lý response
const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        const errorMessage = (data && data.message) || (data && data.error) || response.statusText;
        throw new Error(errorMessage);
    }
    return data;
};

export const productService = {
    getProducts: async () => {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    createProduct: async (formData) => {
        const headers = getAuthHeaders();
        delete headers['Content-Type']; // QUAN TRỌNG: Để browser tự set multipart/form-data

        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: headers,
            body: formData
        });
        return handleResponse(response);
    },

    updateProduct: async (productCode, formData) => {
        const headers = getAuthHeaders();
        delete headers['Content-Type'];

        const response = await fetch(`${API_BASE_URL}/products/${productCode}`, {
            method: 'PUT',
            headers: headers,
            body: formData
        });
        return handleResponse(response);
    },

    deleteProduct: async (productCode) => {
        const response = await fetch(`${API_BASE_URL}/products/${productCode}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
    
    buyProducts: async (buyData) => {
        const response = await fetch(`${API_BASE_URL}/products/buy`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(buyData)
        });
        return handleResponse(response);
    },

    generateImage: async (nameProduct) => {
        const response = await fetch(`${API_BASE_URL}/generate-image`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ prompt: "tạo hình ảnh liên quan tới sản phẩm " + nameProduct + " với màu sắc hài hoà dễ nhìn " })
        });
        return handleResponse(response);
    }

};