import React, { useContext, useRef, useCallback, memo, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { UnicornContext } from '../context/UnicornContext';
import InputText from "../components/InputText";
import InputNumber from "../components/InputNumber";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es obligatorio"),
  color: Yup.string().required("El color es obligatorio"),
  age: Yup.number().min(1, "Debe ser mayor a 0").required("La edad es obligatoria"),
  power: Yup.string().required("El poder especial es obligatorio"),
});

const initialFormValues = { name: "", color: "", age: 1, power: "" };

const CreateUnicornView = ({ onHideDialog }) => {
  const { createUnicorn } = useContext(UnicornContext);
  const toast = useRef(null);

  const handleSuccess = useCallback((message) => {
    if (toast.current) {
      toast.current.show({ severity: "success", summary: "Éxito", detail: message, life: 3000 });
    }
  }, []);

  const handleError = useCallback((message) => {
    if (toast.current) {
      toast.current.show({ severity: "error", summary: "Error", detail: message, life: 3000 });
    }
  }, []);

  const handleSubmit = useCallback(async (values, { resetForm }) => {
    try {
      await createUnicorn(values);
      handleSuccess("Unicornio creado correctamente.");
      resetForm();
      onHideDialog();
    } catch (error) {
      const errorMessage = error?.message || "Hubo un problema al crear el unicornio.";
      handleError(errorMessage);
    }
  }, [createUnicorn, handleSuccess, handleError, onHideDialog]);

  const dialogFooter = useMemo(() => {
    return (
      <div className="flex justify-content-end">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          onClick={onHideDialog}
          className="p-button-text"
        />
      </div>
    );
  }, [onHideDialog]);

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={true}
        onHide={onHideDialog}
        header="Crear Unicornio"
        modal
        style={{ width: "500px" }}
        footer={dialogFooter}
        draggable={false}
        resizable={false}
      >
        <Formik
          initialValues={initialFormValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="p-fluid">
              <div className="field mb-3">
                <label htmlFor="name" className="font-medium mb-1">Nombre</label>
                <Field as={InputText} id="name" name="name" className="w-full" />
                {errors.name && touched.name && <small className="p-error">{errors.name}</small>}
              </div>

              <div className="field mb-3">
                <label htmlFor="color" className="font-medium mb-1">Color</label>
                <Field as={InputText} id="color" name="color" className="w-full" />
                {errors.color && touched.color && <small className="p-error">{errors.color}</small>}
              </div>

              <div className="field mb-3">
                <label htmlFor="age" className="font-medium mb-1">Edad</label>
                <Field name="age">
                  {({ field, form }) => (
                    <InputNumber
                      id="age"
                      value={field.value}
                      onValueChange={(e) => form.setFieldValue("age", e?.value || 1)}
                      min={1}
                      max={1000}
                      className="w-full"
                    />
                  )}
                </Field>
                {errors.age && touched.age && <small className="p-error">{errors.age}</small>}
              </div>

              <div className="field mb-3">
                <label htmlFor="power" className="font-medium mb-1">Poder Especial</label>
                <Field as={InputText} id="power" name="power" className="w-full" />
                {errors.power && touched.power && <small className="p-error">{errors.power}</small>}
              </div>

              <div className="flex justify-content-end mt-4">
                <Button type="submit" label="Guardar" icon="pi pi-save" className="p-button-success" />
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default memo(CreateUnicornView);
