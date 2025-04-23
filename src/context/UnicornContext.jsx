import React, { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getObjects, createObject, updateObject, deleteObject } from '../services/api';
import { Toast } from "primereact/toast";

export const UnicornContext = createContext();

export const UnicornProvider = ({ children }) => {
  const [unicorns, setUnicorns] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);
  const fetchUnicorns = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getObjects();
      setUnicorns(data);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los unicornios.",
        life: 3000,
      });
      console.error("Error al obtener los unicornios:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnicorns();
  }, [fetchUnicorns]);

  const createUnicorn = async (unicorn) => {
    try {
      await createObject(unicorn);
      fetchUnicorns();
      toast.current.show({ severity: "success", summary: "Éxito", detail: "Unicornio creado correctamente!", life: 3000 });
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo crear el unicornio.", life: 3000 });
      console.error("Error al crear el unicornio:", error);
    }
  };

  const updateUnicorn = async (id, updatedUnicorn) => {
    try {
      await updateObject(id, updatedUnicorn);
      fetchUnicorns();
      toast.current.show({ severity: "success", summary: "Éxito", detail: "Unicornio actualizado!", life: 3000 });
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo actualizar el unicornio.", life: 3000 });
      console.error("Error al actualizar el unicornio:", error);
    }
  };

  const deleteUnicorn = async (id) => {
    try {
      const result = await deleteObject(id);
      await fetchUnicorns(); // Actualizar la lista después de eliminar
      toast.current?.show({ 
        severity: "success", 
        summary: "Éxito", 
        detail: "Unicornio eliminado correctamente!", 
        life: 3000 
      });
      return result;
    } catch (error) {
      toast.current?.show({ 
        severity: "error", 
        summary: "Error", 
        detail: error.message || "No se pudo eliminar el unicornio.", 
        life: 3000 
      });
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  };

  const contextValue = useMemo(() => ({
    unicorns,
    loading,
    fetchUnicorns,
    createUnicorn,
    updateUnicorn,
    deleteUnicorn,
  }), [unicorns, loading]);

  return (
    <UnicornContext.Provider value={contextValue}>
      <Toast ref={toast} position="top-right" />
      {children}
    </UnicornContext.Provider>
  );
};
