import React, { useRef, useMemo, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import PropTypes from 'prop-types';

const UnicornsView = ({ 
  unicorns, 
  loading, 
  onEdit, 
  deleteUnicorn, 
  visible, 
  selectedUnicorn, 
  formData, 
  formErrors, 
  onSubmit, 
  onHideDialog, 
  onFormChange 
}) => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const unicornsMemo = useMemo(() => unicorns, [unicorns]);

  const handleNavigateHome = useCallback(() => navigate('/'), [navigate]);
  const handleAddUnicorn = useCallback(() => onEdit(null), [onEdit]);

  const confirmDelete = useCallback((id) => {
    confirmDialog({
      message: "¿Estás seguro de que quieres eliminar este unicornio?",
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, eliminar",
      rejectLabel: "No, cancelar",
      accept: async () => {
        try {
          await deleteUnicorn(id);
        } catch (error) {
          if (toast.current) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: error.message || "No se pudo eliminar el unicornio.",
              life: 3000
            });
          }
        }
      }
    });
  }, [deleteUnicorn, toast]);

  const ageBodyTemplate = useCallback((rowData) => `${rowData.age} años`, []);

  const actionsBodyTemplate = useCallback((rowData) => (
    <>
      <Button
        icon="pi pi-pencil"
        severity="warning"
        onClick={() => onEdit(rowData)}
        tooltip="Editar"
        className="mr-2"
      />
      <Button
        icon="pi pi-trash"
        severity="danger"
        onClick={() => confirmDelete(rowData._id)}
        tooltip="Eliminar"
      />
    </>
  ), [onEdit, confirmDelete]);

  const renderFormDialog = () => {
    if (!visible) return null;

    return (
      <Dialog 
        visible={visible} 
        onHide={onHideDialog} 
        header={selectedUnicorn ? "Editar Unicornio" : "Crear Unicornio"}
        modal
        style={{ width: '450px' }}
        footer={
          <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={onHideDialog} className="p-button-text" />
            <Button label="Guardar" icon="pi pi-check" onClick={onSubmit} autoFocus />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="name" className="font-medium mb-1">Nombre</label>
            <InputText 
              id="name" 
              name="name"
              value={formData.name} 
              onChange={(e) => onFormChange('name', e.target.value)}
              className={formErrors.name ? 'p-invalid' : ''}
            />
            {formErrors.name && <small className="p-error">{formErrors.name}</small>}
          </div>
          
          <div className="field">
            <label htmlFor="color" className="font-medium mb-1">Color</label>
            <InputText 
              id="color" 
              name="color"
              value={formData.color} 
              onChange={(e) => onFormChange('color', e.target.value)}
              className={formErrors.color ? 'p-invalid' : ''}
            />
            {formErrors.color && <small className="p-error">{formErrors.color}</small>}
          </div>
          
          <div className="field">
            <label htmlFor="age" className="font-medium mb-1">Edad</label>
            <InputNumber 
              id="age" 
              name="age"
              value={formData.age} 
              onChange={(e) => onFormChange('age', e.value)}
              min={0} 
              max={1000}
              className={formErrors.age ? 'p-invalid' : ''}
            />
            {formErrors.age && <small className="p-error">{formErrors.age}</small>}
          </div>
          
          <div className="field">
            <label htmlFor="power" className="font-medium mb-1">Poder</label>
            <InputText 
              id="power" 
              name="power"
              value={formData.power} 
              onChange={(e) => onFormChange('power', e.target.value)}
              className={formErrors.power ? 'p-invalid' : ''}
            />
            {formErrors.power && <small className="p-error">{formErrors.power}</small>}
          </div>
        </div>
      </Dialog>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="card">
        <div className="flex justify-between align-items-center mb-3">
          <Button icon="pi pi-home" severity="info" onClick={handleNavigateHome} tooltip="Inicio" />
          <h1>Gestión de Unicornios</h1>
          <Button label="Añadir Unicornio" severity="success" onClick={handleAddUnicorn} />
        </div>

        <DataTable
          value={unicornsMemo}
          loading={loading}
          paginator
          rows={10}
          emptyMessage="No hay unicornios disponibles"
          responsiveLayout="scroll"
        >
          <Column field="name" header="Nombre" sortable />
          <Column field="color" header="Color" sortable />
          <Column field="age" header="Edad" sortable body={ageBodyTemplate} />
          <Column field="power" header="Poder Especial" sortable />
          <Column header="Acciones" body={actionsBodyTemplate} />
        </DataTable>
      </div>

      <ConfirmDialog />
      {renderFormDialog()}
    </>
  );
};

UnicornsView.propTypes = {
  unicorns: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  deleteUnicorn: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  selectedUnicorn: PropTypes.object,
  formData: PropTypes.object,
  formErrors: PropTypes.object,
  onSubmit: PropTypes.func,
  onHideDialog: PropTypes.func,
  onFormChange: PropTypes.func
};

UnicornsView.defaultProps = {
  visible: false,
  selectedUnicorn: null,
  formData: {},
  formErrors: {},
  onSubmit: () => {},
  onHideDialog: () => {},
  onFormChange: () => {}
};

export default React.memo(UnicornsView);