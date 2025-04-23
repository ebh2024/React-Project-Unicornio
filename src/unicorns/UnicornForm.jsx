import React, { useRef, useCallback, memo } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Toast } from 'primereact/toast';
import InputText from "../components/InputText";
import InputNumber from "../components/InputNumber";
import Button from "../components/Button";
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es obligatorio"),
    color: Yup.string().required("El color es obligatorio"),
    age: Yup.number().min(1, "Debe ser mayor a 0").required("La edad es obligatoria"),
    power: Yup.string().required("El poder especial es obligatorio"),
  });

const UnicornForm = ({ initialValues, onSubmit, onDelete }) => {
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

  const handleFormSubmit = useCallback(async (values, { resetForm }) => {
    try {
      await onSubmit(values);
      handleSuccess("Unicornio guardado correctamente.");
      resetForm();
    } catch (error) {
      handleError(error.message || "Hubo un problema al guardar el unicornio.");
    }
  }, [onSubmit, handleSuccess, handleError]);

  const handleDelete = useCallback(async (id) => {
    try {
      await new Promise((resolve, reject) => {
        const result = onDelete(id);
        if (result && typeof result.then === 'function') {
          result.then(resolve).catch(reject);
        } else {
          resolve(result);
        }
      });
      handleSuccess("Unicornio eliminado correctamente.");
    } catch (error) {
      console.error('Error al eliminar:', error);
      handleError(error?.message || "Error al eliminar el unicornio. Por favor, intente nuevamente.");
    }
  }, [onDelete, handleSuccess, handleError]);

  return (
    <>
      <Toast ref={toast} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize={true}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="field mb-3">
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre:</label>
              <Field as={InputText} type="text" id="name" name="name" className="w-full" />
              {errors.name && touched.name && <div className="mt-1 text-sm text-red-500">{errors.name}</div>}
            </div>

            <div className="field mb-3">
              <label htmlFor="color" className="block text-sm font-medium mb-1">Color:</label>
              <Field as={InputText} type="text" id="color" name="color" className="w-full" />
              {errors.color && touched.color && <div className="mt-1 text-sm text-red-500">{errors.color}</div>}
            </div>

            <div className="field mb-3">
              <label htmlFor="age" className="block text-sm font-medium mb-1">Edad:</label>
              <Field name="age">
                {({ field, form }) => (
                  <InputNumber
                    id="age"
                    value={field.value}
                    onValueChange={(e) => form.setFieldValue("age", e?.value || 0)}
                    min={1}
                    max={1000}
                    className="w-full"
                  />
                )}
              </Field>
              {errors.age && touched.age && <div className="mt-1 text-sm text-red-500">{errors.age}</div>}
            </div>

            <div className="field mb-3">
              <label htmlFor="power" className="block text-sm font-medium mb-1">Poder Especial:</label>
              <Field as={InputText} type="text" id="power" name="power" className="w-full" />
              {errors.power && touched.power && <div className="mt-1 text-sm text-red-500">{errors.power}</div>}
            </div>

            <div className="flex justify-content-end">
              <Button type="submit" className="mt-3">Guardar</Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

function areEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps.initialValues) === JSON.stringify(nextProps.initialValues);
}
export default memo(UnicornForm, areEqual);
