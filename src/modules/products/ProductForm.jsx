import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useNavigate, useParams } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  price: Yup.number().required('El precio es obligatorio').positive('El precio debe ser positivo'),
  category: Yup.string(),
});

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [productToEdit, setProductToEdit] = useState(null);
  const [products, setProducts] = useState(() => {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [
      { id: 1, name: 'Product 1', price: 10, category: 'Category 1' },
      { id: 2, name: 'Product 2', price: 20, category: 'Category 2' },
      { id: 3, name: 'Product 3', price: 30, category: 'Category 3' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (id) {
      const product = products.find(p => p.id === parseInt(id));
      setProductToEdit(product);
    }
  }, [id, products]);

  const initialValues = {
    name: productToEdit ? productToEdit.name : '',
    price: productToEdit ? productToEdit.price : '',
    category: productToEdit ? productToEdit.category : '',
  };

  const onSubmit = (values, { setSubmitting }) => {
    try {
      if (productToEdit) {
        // Update
        const updatedProducts = products.map(product =>
          product.id === productToEdit.id ? { ...productToEdit, ...values } : product
        );
        setProducts(updatedProducts);
      } else {
        // Create
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = { id: newId, ...values };
        setProducts([...products, newProduct]);
      }
      setSubmitting(false);
      navigate('/productos');
    } catch (error) {
      console.error('Error saving product:', error);
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{id ? 'Editar Producto' : 'Crear Producto'}</h1>
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
              <label htmlFor="price">Precio</label>
              <Field as={InputText} name="price" id="price" />
              <ErrorMessage name="price" component="div" className="p-error" />
            </div>

            <div className="field">
              <label htmlFor="category">Categoria</label>
              <Field as={InputText} name="category" id="category" />
              <ErrorMessage name="category" component="div" className="p-error" />
            </div>

            <Button label="Guardar" type="submit" disabled={isSubmitting} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductForm;
