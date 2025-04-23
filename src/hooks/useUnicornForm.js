import { useState } from 'react';

const useUnicornForm = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = (data) => {
    const errors = {};

    if (!data.name.trim()) errors.name = 'El nombre es requerido';
    if (!data.color.trim()) errors.color = 'El color es requerido';
    if (data.age < 0 || data.age > 1000) errors.age = 'Edad inválida';
    if (!data.power.trim() || data.power.length < 5) errors.power = 'Poder inválido';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return { formData, formErrors, setFormData, validateForm };
};

export default useUnicornForm;