import React, { useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { UnicornContext } from '../contexts/UnicornContext';
import { useToast } from '../contexts/ToastContext'; // Import useToast
import { confirmDialog } from 'primereact/confirmdialog'; // Import confirmDialog
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './UnicornsView.css';

const UnicornsView = () => {
  const { unicorns, deleteUnicorn } = useContext(UnicornContext);
  const { showToast } = useToast(); // Use the toast hook
  const navigate = useNavigate();

  const editUnicorn = (unicorn) => {
    navigate('/unicornios/editar/' + unicorn._id);
  };

  const confirmDelete = (id, name) => {
    confirmDialog({
      message: `¿Estás seguro de que quieres eliminar el unicornio "${name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'No, cancelar',
      accept: async () => {
        try {
          await deleteUnicorn(id);
          showToast('success', 'Éxito', `Unicornio "${name}" eliminado.`);
        } catch (error) {
          showToast('error', 'Error', `No se pudo eliminar el unicornio "${name}".`);
          console.error("Error deleting unicorn:", error);
        }
      },
      reject: () => {
        showToast('info', 'Cancelado', 'Eliminación cancelada.');
      }
    });
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
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDelete(rowData._id, rowData.name)} />
      </React.Fragment>
    );
  };

  const header = (
    <div className="unicorns-view-header">
      <Link to="/" className="unicorns-view-link-home">Inicio</Link>
      <Link to="/unicornios/crear" className="unicorns-view-link-new">Nuevo</Link>
      <Button label="Exportar PDF" icon="pi pi-file-pdf" className="p-button-danger" onClick={exportPDF} />
    </div>
  );

  return (
    <div className="unicorns-view-datatable-container">
      <DataTable value={unicorns} header={header} paginator rows={5} className="unicorns-view-datatable">
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
