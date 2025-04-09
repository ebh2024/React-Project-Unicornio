import axios from 'axios';

// ID del endpoint de crudcrud.com
const ENDPOINT_ID = '72b5af9caa92410e9d883e29aa53707d';

const api = axios.create({
  baseURL: `https://crudcrud.com/api/${ENDPOINT_ID}`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar errores de manera consistente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      switch (error.response.status) {
        case 400:
          errorMessage = 'Los datos enviados no son válidos';
          break;
        case 404:
          errorMessage = 'El recurso solicitado no existe';
          break;
        case 429:
          errorMessage = 'Has excedido el límite de peticiones. Por favor, espera un momento';
          break;
        default:
          errorMessage = 'Error en la comunicación con el servidor';
      }
      console.error('Error de respuesta:', {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet';
      console.error('Error de red - No hay respuesta del servidor');
    } else {
      console.error('Error de configuración:', error.message);
    }

    throw new Error(errorMessage);
  }
);

export const getObjects = async () => {
  try {
    const response = await api.get('/unicorns');
    return response.data;
  } catch (error) {
    console.error('Error al obtener unicornios:', error);
    throw error;
  }
};

export const createObject = async (objectData) => {
  try {
    const response = await api.post('/unicorns', objectData);
    return response.data;
  } catch (error) {
    console.error('Error al crear unicornio:', error);
    throw error;
  }
};

export const updateObject = async (id, objectData) => {
  try {
    const response = await api.put(`/unicorns/${id}`, objectData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar unicornio:', error);
    throw error;
  }
};

export const deleteObject = async (id) => {
  try {
    await api.delete(`/unicorns/${id}`);
  } catch (error) {
    console.error('Error al eliminar unicornio:', error);
    throw error;
  }
}; 