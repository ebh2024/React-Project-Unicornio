import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProductsView from './ProductsView';
import ProductForm from './ProductForm';

const ProductsModule = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductsView />} />
      <Route path="/crear" element={<ProductForm />} />
      <Route path="/editar/:id" element={<ProductForm />} />
    </Routes>
  );
};

export default ProductsModule;
