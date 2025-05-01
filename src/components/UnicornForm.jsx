import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { UnicornContext } from '../contexts/UnicornContext';
import { useNavigate, useParams } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  age: Yup.number().required('Age is required').positive('Age must be positive'),
  color: Yup.string(),
  power: Yup.string().required('Power is required'),
});

const UnicornForm = () => {
  const { createUnicorn, editUnicorn, unicorns } = useContext(UnicornContext);
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
      } else {
        await createUnicorn(values);
      }
      setSubmitting(false);
      navigate('/unicornios');
    } catch (error) {
      console.error('Error saving unicorn:', error);
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
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

            <Button label={unicornToEdit ? 'Actualizar' : 'Crear'} type="submit" disabled={isSubmitting} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UnicornForm;
