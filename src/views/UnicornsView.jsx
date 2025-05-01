import React, { useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { UnicornContext } from '../contexts/UnicornContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const UnicornsView = () => {
  const { unicorns, deleteUnicorn } = useContext(UnicornContext);
  const navigate = useNavigate();

  const editUnicorn = (unicorn) => {
    navigate('/unicornios/editar/' + unicorn._id);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este unicornio?')) {
      deleteUnicorn(id);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Listado de Unicornios', 14, 16);
  
    const tableColumn = ['Nombre', 'Edad', 'Color', 'Poder'];
    const tableRows = unicorns.map(unicorn => [
      unicorn.name,
      unicorn.age,
      unicorn.color,
      unicorn.power
    ]);
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });
  
    doc.save('unicorns-list.pdf');
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUnicorn(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => handleDelete(rowData._id)} />
      </React.Fragment>
    );
  };

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
      <Link to="/unicornios/crear" style={{
        fontSize: '1.2em',
        padding: '5px 10px',
        backgroundColor: '#007bff',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '5px'
      }}>Nuevo</Link>
      <Button label="Exportar PDF" icon="pi pi-file-pdf" className="p-button-danger" onClick={exportPDF} />
    </div>
  );

  return (
    <div className="datatable-crud-demo" style={{
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <DataTable value={unicorns} header={header} paginator rows={5} style={{ marginTop: '20px' }}>
        <Column field="name" header="Nombre" sortable filter />
        <Column field="age" header="Edad" sortable filter />
        <Column field="color" header="Color" sortable filter />
        <Column field="power" header="Poder" sortable filter />
        <Column body={actionBodyTemplate} header="Acciones" />
      </DataTable>
    </div>
  );
};

export default UnicornsView;