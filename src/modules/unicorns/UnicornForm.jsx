import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { UnicornContext } from './context/UnicornContext'; // Updated path
import { useToast } from '../../contexts/ToastContext'; // Corrected path
import { useNavigate, useParams } from 'react-router-dom';
import './UnicornForm.css'; // This path will be correct once CSS is also moved

const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  age: Yup.number().required('La edad es obligatoria').positive('La edad debe ser un número positivo'),
  color: Yup.string(), // Assuming color is optional, no message needed if not required
  power: Yup.string().required('El poder es obligatorio'),
});

const UnicornForm = () => {
  const { createUnicorn, editUnicorn, unicorns } = useContext(UnicornContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const unicornToEdit = id ? unicorns.find(unicorn => unicorn._id === id) : null;

  const initialValues = {
    name: '',
    age: '',
    color: '',
    power: '',
  };

  if (unicornToEdit) {
    initialValues.name = unicornToEdit.name || '';
    initialValues.age = unicornToEdit.age || '';
    initialValues.color = unicornToEdit.color || '';
    initialValues.power = unicornToEdit.power || '';
  }

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      if (unicornToEdit) {
        await editUnicorn({ ...unicornToEdit, ...values });
        showToast('success', 'Éxito', 'Unicornio actualizado correctamente.');
      } else {
        await createUnicorn(values);
        showToast('success', 'Éxito', 'Unicornio creado correctamente.');
      }
      setSubmitting(false);
      navigate('/unicornios');
    } catch (error) {
      console.error('Error saving unicorn:', error);
      showToast('error', 'Error', 'No se pudo guardar el unicornio.');
      setSubmitting(false);
    }
  };

  return (
    <div className="unicorn-form-container">
      <h1>{unicornToEdit ? 'Editar Unicornio' : 'Crear Unicornio'}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <Field as={InputText} name="name" id="name" />
              <ErrorMessage name="name" component="div" className="p-error" />
            </div>

            <div className="field">
              <label htmlFor="age">Edad</label>
              <Field as={InputText} name="age" id="age" />
              <ErrorMessage name="age" component="div" className="p-error" />
            </div>

            <div className="field">
              <label htmlFor="color">Color</label>
              <Field as={InputText} name="color" id="color" />
              <ErrorMessage name="color" component="div" className="p-error" />
            </div>

            <div className="field">
              <label htmlFor="power">Poder</label>
              <Field as={InputText} name="power" id="power" />
              <ErrorMessage name="power" component="div" className="p-error" />
            </div>

            <div className="form-button-group">
              <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => navigate(-1)}
                type="button"
                disabled={isSubmitting}
              />
              <Button
                label={unicornToEdit ? 'Actualizar' : 'Crear'}
                icon="pi pi-check"
                type="submit"
                disabled={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UnicornForm;
