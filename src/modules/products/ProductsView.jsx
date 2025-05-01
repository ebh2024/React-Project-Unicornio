import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';

const ProductsView = () => {
  const navigate = useNavigate();
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

  const editProduct = (product) => {
    navigate('/productos/editar/' + product.id);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => deleteProduct(rowData.id)} />
      </React.Fragment>
    );
  }

  const header = (
    <div className="table-header" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px'
    }}>
      <Link to="/" style={{
        fontSize: '1.2em',
        padding: '5px 10px',
        backgroundColor: '#6c757d',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '5px'
      }}>Inicio</Link>
      <Link to="/productos/crear" style={{
        fontSize: '1.2em',
        padding: '5px 10px',
        backgroundColor: '#007bff',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '5px'
      }}>Nuevo</Link>
    </div>
  );


  return (
    <div className="datatable-crud-demo" style={{
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <DataTable value={products} header={header} style={{
        marginTop: '20px'
      }}>
        <Column field="name" header="Nombre" sortable />
        <Column field="price" header="Precio" sortable />
        <Column field="category" header="Categoria" sortable />
        <Column body={actionBodyTemplate} header="Acciones" />
      </DataTable>
    </div>
  );
};

export default ProductsView;
