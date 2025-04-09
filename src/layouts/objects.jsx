import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { getObjects, createObject, updateObject, deleteObject } from '../services/api';

const ObjectsContainer = () => {
  const [unicorns, setUnicorns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedUnicorn, setSelectedUnicorn] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    age: 5,
    power: ''
  });

  useEffect(() => {
    fetchUnicorns();
  }, []);

  const fetchUnicorns = async () => {
    try {
      const data = await getObjects();
      setUnicorns(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching unicorns:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUnicorn) {
        await updateObject(selectedUnicorn._id, formData);
      } else {
        await createObject(formData);
      }
      setVisible(false);
      setFormData({ name: '', color: '', age: 5, power: '' });
      setSelectedUnicorn(null);
      fetchUnicorns();
    } catch (error) {
      console.error('Error saving unicorn:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteObject(id);
      fetchUnicorns();
    } catch (error) {
      console.error('Error deleting unicorn:', error);
    }
  };

  const handleEdit = (unicorn) => {
    setSelectedUnicorn(unicorn);
    setFormData({
      name: unicorn.name,
      color: unicorn.color,
      age: unicorn.age,
      power: unicorn.power
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

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Unicornios</h1>
        <Button
          label="Añadir Unicornio"
          icon="pi pi-plus"
          onClick={() => setVisible(true)}
        />
      </div>

      <DataTable
        value={unicorns}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column field="name" header="Nombre" sortable />
        <Column field="color" header="Color" sortable />
        <Column field="age" header="Edad" sortable />
        <Column field="power" header="Poder Especial" sortable />
        <Column body={actionBodyTemplate} header="Acciones" />
      </DataTable>

      <Dialog
        visible={visible}
        onHide={() => {
          setVisible(false);
          setSelectedUnicorn(null);
          setFormData({ name: '', color: '', age: 5, power: '' });
        }}
        header={selectedUnicorn ? 'Editar Unicornio' : 'Nuevo Unicornio'}
      >
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field">
            <label htmlFor="name">Nombre del Unicornio</label>
            <InputText
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="color">Color Principal</label>
            <InputText
              id="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="age">Edad</label>
            <InputNumber
              id="age"
              value={formData.age}
              onValueChange={(e) => setFormData({ ...formData, age: e.value })}
              required
              min={0}
            />
          </div>
          <div className="field">
            <label htmlFor="power">Poder Especial</label>
            <InputText
              id="power"
              value={formData.power}
              onChange={(e) => setFormData({ ...formData, power: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-content-end mt-3">
            <Button
              type="button"
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => {
                setVisible(false);
                setSelectedUnicorn(null);
                setFormData({ name: '', color: '', age: 5, power: '' });
              }}
            />
            <Button
              type="submit"
              label={selectedUnicorn ? 'Actualizar' : 'Guardar'}
              icon="pi pi-check"
              className="p-button-text"
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default ObjectsContainer; 