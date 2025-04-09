import { useState, useEffect } from 'react';
import { getObjects, createObject, updateObject, deleteObject } from '../services/api';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import UnicornsView from './UnicornsView';

/**
 * Contenedor principal para la gestión de unicornios.
 * Maneja la lógica de negocio y el estado de la aplicación.
 */
const UnicornsContainer = () => {
  const toast = useRef(null);
  const [unicorns, setUnicorns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedUnicorn, setSelectedUnicorn] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    age: 5,
    power: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchUnicorns = async () => {
      try {
        const data = await getObjects();
        setUnicorns(data);
      } catch (error) {
        showError('No se pudieron cargar los unicornios. Por favor, intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchUnicorns();
  }, []);

  const showSuccess = (message) => {
    toast.current.show({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: 3000,
      icon: 'pi pi-check-circle'
    });
  };

  const showError = (message) => {
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000,
      icon: 'pi pi-times-circle',
      closeIcon: 'pi pi-times'
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.color.trim()) {
      errors.color = 'El color es requerido';
    }

    if (formData.age < 0) {
      errors.age = 'La edad no puede ser negativa';
    } else if (formData.age > 1000) {
      errors.age = 'La edad no puede ser mayor a 1000 años';
    }

    if (!formData.power.trim()) {
      errors.power = 'El poder es requerido';
    } else if (formData.power.length < 5) {
      errors.power = 'El poder debe tener al menos 5 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Por favor, corrija los errores en el formulario');
      return;
    }

    try {
      if (selectedUnicorn) {
        await updateObject(selectedUnicorn._id, formData);
        showSuccess('Unicornio actualizado correctamente');
      } else {
        await createObject(formData);
        showSuccess('Unicornio creado correctamente');
      }
      handleHideDialog();
      const updatedData = await getObjects();
      setUnicorns(updatedData);
    } catch (error) {
      showError('Hubo un problema al guardar el unicornio');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteObject(id);
      const updatedData = await getObjects();
      setUnicorns(updatedData);
      showSuccess('Unicornio eliminado correctamente');
    } catch (error) {
      showError('No se pudo eliminar el unicornio');
    }
  };

  const handleEdit = (unicorn) => {
    setSelectedUnicorn(unicorn);
    setFormData(unicorn ? {
      name: unicorn.name,
      color: unicorn.color,
      age: unicorn.age,
      power: unicorn.power
    } : {
      name: '',
      color: '',
      age: 5,
      power: ''
    });
    setFormErrors({});
    setVisible(true);
  };

  const handleHideDialog = () => {
    setVisible(false);
    setSelectedUnicorn(null);
    setFormData({ name: '', color: '', age: 5, power: '' });
    setFormErrors({});
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const viewProps = {
    unicorns,
    loading,
    visible,
    selectedUnicorn,
    formData,
    formErrors,
    onSubmit: handleSubmit,
    onDelete: handleDelete,
    onEdit: handleEdit,
    onHideDialog: handleHideDialog,
    onFormChange: handleFormChange
  };

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <UnicornsView {...viewProps} />
    </>
  );
};

export default UnicornsContainer; 