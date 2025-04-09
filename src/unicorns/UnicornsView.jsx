import PropTypes from 'prop-types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de presentación para la vista de unicornios.
 * Maneja la interfaz de usuario y la presentación de datos.
 */
const UnicornsView = ({
  unicorns,
  loading,
  visible,
  selectedUnicorn,
  formData,
  formErrors,
  onSubmit,
  onDelete,
  onEdit,
  onHideDialog,
  onFormChange,
}) => {
  const navigate = useNavigate();
  
  const confirmDelete = (id) => {
    confirmDialog({
      message: '¿Estás seguro de que quieres eliminar este unicornio?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'No, cancelar',
      accept: () => onDelete(id)
    });
  };

  /**
   * Renderiza los botones de acción para cada fila
   * @param {Object} rowData - Datos de la fila actual
   */
  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2 justify-content-center">
      <Button
        icon="pi pi-pencil"
        rounded
        outlined
        className="p-button-warning"
        onClick={() => onEdit(rowData)}
        tooltip="Editar unicornio"
      />
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        onClick={() => confirmDelete(rowData._id)}
        tooltip="Eliminar unicornio"
      />
    </div>
  );

  const getFormErrorMessage = (name) => {
    return formErrors[name] ? (
      <small className="p-error">{formErrors[name]}</small>
    ) : null;
  };

  return (
    <div className="card p-4">
      <div className="flex justify-content-between align-items-center mb-4">
        <div className="flex align-items-center gap-3">
          <Button
            icon="pi pi-home"
            rounded
            outlined
            severity="info"
            onClick={() => navigate('/')}
            tooltip="Volver al inicio"
          />
          <h1 className="text-3xl font-bold text-900 m-0">Gestión de Unicornios</h1>
        </div>
        <Button
          label="Añadir Unicornio"
          icon="pi pi-plus"
          severity="success"
          onClick={() => onEdit(null)}
        />
      </div>

      <DataTable
        value={unicorns}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        emptyMessage="No se encontraron unicornios"
        className="p-datatable-striped"
        showGridlines
        stripedRows
      >
        <Column 
          field="name" 
          header="Nombre" 
          sortable 
          className="font-semibold"
        />
        <Column 
          field="color" 
          header="Color" 
          sortable 
        />
        <Column 
          field="age" 
          header="Edad" 
          sortable
          body={(rowData) => `${rowData.age} años`}
        />
        <Column 
          field="power" 
          header="Poder Especial" 
          sortable 
        />
        <Column 
          body={actionBodyTemplate} 
          header="Acciones"
          style={{ width: '10rem' }}
          className="text-center"
        />
      </DataTable>

      <Dialog
        visible={visible}
        onHide={onHideDialog}
        header={selectedUnicorn ? 'Editar Unicornio' : 'Nuevo Unicornio'}
        modal
        className="p-fluid"
        style={{ width: '450px' }}
        closeIcon="pi pi-times"
        showHeader={true}
        closable={true}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              severity="danger"
              outlined
              onClick={onHideDialog}
            />
            <Button
              label={selectedUnicorn ? 'Actualizar' : 'Guardar'}
              icon="pi pi-check"
              type="submit"
              severity="success"
              form="unicornForm"
            />
          </div>
        }
      >
        <form id="unicornForm" onSubmit={onSubmit} className="p-fluid">
          <div className="field mb-4">
            <label htmlFor="name" className={classNames({ 'p-error': formErrors.name })}>
              Nombre del Unicornio*
            </label>
            <InputText
              id="name"
              value={formData.name}
              onChange={(e) => onFormChange('name', e.target.value)}
              className={classNames({ 'p-invalid': formErrors.name })}
              aria-describedby="name-help"
            />
            {getFormErrorMessage('name')}
          </div>

          <div className="field mb-4">
            <label htmlFor="color" className={classNames({ 'p-error': formErrors.color })}>
              Color Principal*
            </label>
            <InputText
              id="color"
              value={formData.color}
              onChange={(e) => onFormChange('color', e.target.value)}
              className={classNames({ 'p-invalid': formErrors.color })}
            />
            {getFormErrorMessage('color')}
          </div>

          <div className="field mb-4">
            <label htmlFor="age" className={classNames({ 'p-error': formErrors.age })}>
              Edad*
            </label>
            <InputNumber
              id="age"
              value={formData.age}
              onValueChange={(e) => onFormChange('age', e.value)}
              className={classNames({ 'p-invalid': formErrors.age })}
              min={0}
              max={1000}
            />
            {getFormErrorMessage('age')}
          </div>

          <div className="field mb-4">
            <label htmlFor="power" className={classNames({ 'p-error': formErrors.power })}>
              Poder Especial*
            </label>
            <InputText
              id="power"
              value={formData.power}
              onChange={(e) => onFormChange('power', e.target.value)}
              className={classNames({ 'p-invalid': formErrors.power })}
            />
            {getFormErrorMessage('power')}
          </div>
        </form>
      </Dialog>

      <ConfirmDialog />
    </div>
  );
};

UnicornsView.propTypes = {
  unicorns: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
      power: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  selectedUnicorn: PropTypes.object,
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    power: PropTypes.string.isRequired,
  }).isRequired,
  formErrors: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onHideDialog: PropTypes.func.isRequired,
  onFormChange: PropTypes.func.isRequired,
};

export default UnicornsView; 