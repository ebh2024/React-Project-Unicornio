import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  price: Yup.number().min(1, 'El precio debe ser mayor a 0').required('El precio es obligatorio'),
});

const ProductForm = ({ onAddProduct }) => {
  return (
    <Formik
      initialValues={{ name: '', price: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onAddProduct(values);
        resetForm();
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <div>
            <label>Nombre:</label>
            <Field type="text" name="name" />
            {errors.name && touched.name && <small>{errors.name}</small>}
          </div>

          <div>
            <label>Precio:</label>
            <Field type="number" name="price" />
            {errors.price && touched.price && <small>{errors.price}</small>}
          </div>

          <button type="submit">Agregar Producto</button>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;