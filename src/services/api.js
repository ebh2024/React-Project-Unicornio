import axios from 'axios';

// Endpoint de la API (válido por 24 horas)
const ENDPOINT_ID = '72b5af0caa92410e9d883e29aa53707d';

// Crear instancia de axios con la configuración base
const api = axios.create({
    baseURL: `https://crudcrud.com/api/${ENDPOINT_ID}`,
});

// Interceptor para manejar errores
api.interceptors.response.use(
    response => response,
    error => {
        console.error('Error en la petición:', error);
        if (error.response) {
            // El servidor respondió con un código de error
            console.error('Datos del error:', error.response.data);
            console.error('Estado:', error.response.status);
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            console.error('No se recibió respuesta del servidor');
        } else {
            // Algo sucedió en la configuración de la petición
            console.error('Error de configuración:', error.message);
        }
        return Promise.reject(error);
    }
);

// Funciones para operaciones CRUD
export const getObjects = () => api.get('/unicorns').then(res => res.data);
export const createObject = (data) => api.post('/unicorns', data).then(res => res.data);
export const updateObject = (id, data) => api.put(`/unicorns/${id}`, data).then(res => res.data);
export const deleteObject = (id) => api.delete(`/unicorns/${id}`).then(res => res.data);

export default api; 