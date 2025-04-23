import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from 'react';
import { UnicornContext } from '../context/UnicornContext';
import { Toast } from 'primereact/toast';
import UnicornsView from './UnicornsView';
import useUnicornForm from '../hooks/useUnicornForm';

const TOAST_SETTINGS = {
  success: {
    severity: 'success',
    summary: 'Éxito',
    life: 3000,
    icon: 'pi pi-check-circle',
  },
  error: {
    severity: 'error',
    summary: 'Error',
    life: 5000,
    icon: 'pi pi-times-circle',
  }
};

const UnicornsContainer = () => {
  const toast = useRef(null);
  const { unicorns, loading, fetchUnicorns, createUnicorn, updateUnicorn, deleteUnicorn } = useContext(UnicornContext);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedUnicorn, setSelectedUnicorn] = useState(null);

  const initialFormState = useMemo(() => ({
    name: '',
    color: '',
    age: 5,
    power: '',
  }), []);

  const { formData, formErrors, setFormData, validateForm } = useUnicornForm(initialFormState);

  const handleHideDialog = useCallback(() => {
    setIsDialogVisible(false);

    setTimeout(() => {
      setSelectedUnicorn(null);
      setFormData(initialFormState);
    }, 100);
  }, [setFormData, initialFormState]);

  useEffect(() => {
    let isMounted = true;

    const loadUnicorns = async () => {
      if (unicorns.length === 0 && !loading) {
        try {
          await fetchUnicorns();
        } catch {
          if (isMounted && toast.current) {
            toast.current.show({
              ...TOAST_SETTINGS.error,
              detail: 'Error al cargar los unicornios. Intente nuevamente.'
            });
          }
        }
      }
    };

    loadUnicorns();

    return () => {
      isMounted = false;
    };
  }, [fetchUnicorns, unicorns.length, loading]);

  const showToast = useCallback((type, message) => {
    if (toast.current) {
      toast.current.show({
        ...TOAST_SETTINGS[type],
        detail: message
      });
    }
  }, []);

  const showSuccess = useCallback((message) => {
    showToast('success', message);
  }, [showToast]);

  const showError = useCallback((message) => {
    showToast('error', message);
  }, [showToast]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm(formData)) {
      showError('Por favor, corrija los errores en el formulario.');
      return;
    }

    try {
      if (selectedUnicorn) {
        await updateUnicorn(selectedUnicorn._id, formData);
        showSuccess('Unicornio actualizado correctamente.');
      } else {
        await createUnicorn(formData);
        showSuccess('Unicornio creado correctamente.');
      }
      handleHideDialog();

      fetchUnicorns();
    } catch (error) {
      console.error('Error al guardar unicornio:', error);
      const errorMessage = error?.message || 'Error desconocido';
      showError(`Hubo un problema al guardar el unicornio: ${errorMessage}`);
    }
  }, [validateForm, formData, selectedUnicorn, updateUnicorn, createUnicorn, showSuccess, showError, handleHideDialog, fetchUnicorns]);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteUnicorn(id);
      await fetchUnicorns();
      showSuccess('Unicornio eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar unicornio:', error);
      showError(error?.message || 'No se pudo eliminar el unicornio');
    }
  }, [deleteUnicorn, fetchUnicorns, showSuccess, showError]);

  const handleEdit = useCallback((unicorn) => {
    setSelectedUnicorn(unicorn);
    setFormData(unicorn ? { ...unicorn } : initialFormState);
    setIsDialogVisible(true);
  }, [setFormData, initialFormState]);

  const handleFormChange = useCallback((field, value) => {
    if (field === 'age' && (isNaN(value) || value < 0)) {
      value = 0;
    }

    setFormData(prevData => {
      const updatedData = { ...prevData, [field]: value };
      validateForm(updatedData);
      return updatedData;
    });
  }, [setFormData, validateForm]);

  const viewProps = useMemo(() => ({
    unicorns,
    loading,
    visible: isDialogVisible,
    selectedUnicorn,
    formData,
    formErrors,
    onSubmit: handleSubmit,
    onDelete: handleDelete,
    onEdit: handleEdit,
    onHideDialog: handleHideDialog,
    onFormChange: handleFormChange,
  }), [
    unicorns,
    loading,
    isDialogVisible,
    selectedUnicorn,
    formData,
    formErrors,
    handleSubmit,
    handleDelete,
    handleEdit,
    handleHideDialog,
    handleFormChange
  ]);

  if (loading && unicorns.length === 0) {
    return (
      <>
        <Toast ref={toast} position="top-right" />
        <div className="loading-container">Cargando unicornios...</div>
      </>
    );
  }

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <UnicornsView 
        {...viewProps} 
        deleteUnicorn={handleDelete} 
      />
    </>
  );
};

function arePropsEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default React.memo(UnicornsContainer, arePropsEqual);

