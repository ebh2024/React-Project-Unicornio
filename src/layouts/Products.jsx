import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { getObjects, createObject, updateObject, deleteObject } from '../services/api';

const ProductContainer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getObjects();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        await updateObject(selectedProduct._id, formData);
      } else {
        await createObject(formData);
      }
      setVisible(false);
      setFormData({ name: '', price: 0, stock: 0 });
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteObject(id);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock
    });
    setVisible(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text mr-2"
          onClick={() => handleEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-text p-button-danger"
          onClick={() => handleDelete(rowData._id)}
        />
      </div>
    );
  };

  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(rowData.price);
  };

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-4">
        <h1>Products Management</h1>
        <Button
          label="Add New"
          icon="pi pi-plus"
          onClick={() => setVisible(true)}
        />
      </div>

      <DataTable
        value={products}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column field="name" header="Name" sortable />
        <Column field="price" header="Price" body={priceBodyTemplate} sortable />
        <Column field="stock" header="Stock" sortable />
        <Column body={actionBodyTemplate} header="Actions" />
      </DataTable>

      <Dialog
        visible={visible}
        onHide={() => {
          setVisible(false);
          setSelectedProduct(null);
          setFormData({ name: '', price: 0, stock: 0 });
        }}
        header={selectedProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="price">Price</label>
            <InputNumber
              id="price"
              value={formData.price}
              onValueChange={(e) => setFormData({ ...formData, price: e.value })}
              mode="currency"
              currency="USD"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="stock">Stock</label>
            <InputNumber
              id="stock"
              value={formData.stock}
              onValueChange={(e) => setFormData({ ...formData, stock: e.value })}
              required
            />
          </div>
          <div className="flex justify-content-end mt-3">
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => {
                setVisible(false);
                setSelectedProduct(null);
                setFormData({ name: '', price: 0, stock: 0 });
              }}
            />
            <Button
              type="submit"
              label={selectedProduct ? 'Update' : 'Save'}
              icon="pi pi-check"
              className="p-button-text"
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default ProductContainer; 