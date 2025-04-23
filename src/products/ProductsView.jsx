import React, { useState, useEffect } from 'react';
import { productsData } from './productsData';
import ProductForm from './ProductForm';

const ProductsView = () => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : productsData;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { id: Date.now(), ...newProduct }]);
  };

  return (
    <div>
      <h1>Lista de Productos</h1>
      <ProductForm onAddProduct={handleAddProduct} />
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsView;