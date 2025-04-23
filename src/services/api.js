import axios from 'axios';

const DEBUG_MODE = true;

const CONFIG = {
  ENDPOINT_ID: 'aa14dfd92f4c4cf1af6d022d650ca200',
  TIMEOUT: 10000,
  RESOURCE: 'unicorns'
};

const api = axios.create({
  baseURL: `/api/api/${CONFIG.ENDPOINT_ID}`,
  timeout: CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  validateStatus: status => status >= 200 && status < 300,
  maxRedirects: 5,
  timeoutErrorMessage: 'La solicitud ha excedido el tiempo límite'
});

const cache = {
  data: new Map(),
  timestamp: new Map(),
  maxAge: 60000,

  get(key) {
    const now = Date.now();
    if (this.data.has(key) && (now - this.timestamp.get(key)) < this.maxAge) {
      return this.data.get(key);
    }
    return null;
  },

  set(key, value) {
    this.data.set(key, value);
    this.timestamp.set(key, Date.now());
  },

  invalidate(key) {
    this.data.delete(key);
    this.timestamp.delete(key);
  },

  clear() {
    this.data.clear();
    this.timestamp.clear();
  }
};

api.interceptors.response.use(
    response => response,
    error => {
    const errorDetails = {
      message: 'Error en la petición API',
      url: error.config?.url || 'URL desconocida',
      method: error.config?.method?.toUpperCase() || 'Método desconocido',
      timestamp: new Date().toISOString()
    };

    if (error.message && error.message.includes('Network Error')) {
      console.error('CORS Error or Network Issue:', error);
      return Promise.reject({
        ...error,
        message: 'Error de CORS o problema de red. Intenta usar el proxy o actualizar el token.'
      });
    }

    if (error.response) {
      errorDetails.status = error.response.status;
      errorDetails.data = error.response.data;
      errorDetails.type = 'Respuesta de error del servidor';
    } else if (error.request) {
      errorDetails.type = 'Sin respuesta del servidor';
      errorDetails.request = error.request;
    } else {
      errorDetails.type = 'Error de configuración';
      errorDetails.details = error.message;
  }

    console.error(JSON.stringify(errorDetails, null, 2));

    if (error.code === 'ECONNABORTED' || !error.response) {
      return Promise.reject({
        ...error,
        customError: true,
        message: 'Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.'
      });
    }

    return Promise.reject(error);
  }
);

export const getObjects = async (useCache = true) => {
  const cacheKey = `getAll_${CONFIG.RESOURCE}`;

  if (useCache) {
    const cachedData = cache.get(cacheKey);
    if (cachedData) return cachedData;
  }

  try {
    const response = await api.get(`/${CONFIG.RESOURCE}`);
    cache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener ${CONFIG.RESOURCE}: ${error.message}`);
  }
};

export const createObject = async (data) => {
  try {
    const response = await api.post(`/${CONFIG.RESOURCE}`, data);
    cache.invalidate(`getAll_${CONFIG.RESOURCE}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al crear ${CONFIG.RESOURCE}: ${error.message}`);
  }
};

export const updateObject = async (id, data) => {
  if (!id) throw new Error(`ID es requerido para actualizar ${CONFIG.RESOURCE}`);

  const { _id, ...dataWithoutId } = data;

  try {
    const response = await api.put(`/${CONFIG.RESOURCE}/${id}`, dataWithoutId);
    cache.invalidate(`getAll_${CONFIG.RESOURCE}`);
    cache.invalidate(`get_${CONFIG.RESOURCE}_${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 500) {
      console.error('Error 500 en la actualización. Posible problema con la estructura de datos.');
      throw new Error(`Error al actualizar ${CONFIG.RESOURCE}: El servidor no pudo procesar la solicitud. Verifica que no estés modificando campos que no se pueden cambiar.`);
    }
    throw new Error(`Error al actualizar ${CONFIG.RESOURCE} (ID: ${id}): ${error.message}`);
  }
};

export const deleteObject = async (id) => {
  if (!id) throw new Error(`ID es requerido para eliminar ${CONFIG.RESOURCE}`);

  try {
    const response = await api.delete(`/${CONFIG.RESOURCE}/${id}`);
    
    if (!response || response.status !== 200) {
      throw new Error('Error al eliminar: Respuesta inválida del servidor');
    }

    // Invalidar el caché
    cache.invalidate(`getAll_${CONFIG.RESOURCE}`);
    cache.invalidate(`get_${CONFIG.RESOURCE}_${id}`);

    return {
      success: true,
      message: `${CONFIG.RESOURCE} eliminado correctamente`
    };
  } catch (error) {
    console.error('Error en eliminación:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    throw new Error(error.response?.data?.message || 
                   error.message || 
                   `Error al eliminar ${CONFIG.RESOURCE}`);
  }
};

export const getObjectById = async (id, useCache = true) => {
  if (!id) throw new Error(`ID es requerido para obtener ${CONFIG.RESOURCE}`);

  const cacheKey = `get_${CONFIG.RESOURCE}_${id}`;

  if (useCache) {
    const cachedData = cache.get(cacheKey);
    if (cachedData) return cachedData;
  }

  try {
    const response = await api.get(`/${CONFIG.RESOURCE}/${id}`);
    cache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener ${CONFIG.RESOURCE} (ID: ${id}): ${error.message}`);
  }
};

export const invalidateCache = () => {
  cache.clear();
};

export default {
  instance: api,
  config: CONFIG,
  cache
};
