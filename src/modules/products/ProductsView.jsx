import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext'; // Import useToast
import { confirmDialog } from 'primereact/confirmdialog'; // Import confirmDialog
import './ProductsView.css';

const ProductsView = () => {
  const navigate = useNavigate();
  const { showToast } = useToast(); // Use the toast hook
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

  const confirmDeleteProduct = (id, name) => {
    confirmDialog({
      message: `¿Estás seguro de que quieres eliminar el producto "${name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'No, cancelar',
      accept: () => {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
        showToast('success', 'Éxito', `Producto "${name}" eliminado.`);
      },
      reject: () => {
        showToast('info', 'Cancelado', 'Eliminación cancelada.');
      }
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData.id, rowData.name)} />
      </React.Fragment>
    );
  }

  const header = (
    <div className="products-view-header">
      <Link to="/" className="products-view-link-home">Inicio</Link>
      <Link to="/productos/crear" className="products-view-link-new">Nuevo</Link>
    </div>
  );


  return (
    <div className="products-view-datatable-container">
      <DataTable value={products} header={header} className="products-view-datatable">
        <Column field="name" header="Nombre" sortable />
        <Column field="price" header="Precio" sortable />
        <Column field="category" header="Categoria" sortable />
        <Column body={actionBodyTemplate} header="Acciones" />
      </DataTable>
    </div>
  );
};

export default ProductsView;
