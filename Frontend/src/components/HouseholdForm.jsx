// components/HouseholdForm.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("A név megadása kötelező"),
  address: Yup.string().optional(),
});

export default function HouseholdForm({
  initialValues,
  onSubmit,
  submitLabel,
}) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6 bg-white p-6 rounded-xl shadow-md">
          <div>
            <label htmlFor="name" className="block font-semibold mb-1">
              Név <span className="text-red-500">*</span>
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              className="w-full border rounded px-4 py-2"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          <div>
            <label htmlFor="address" className="block font-semibold mb-1">
              Cím (opcionális)
            </label>
            <Field
              id="address"
              name="address"
              type="text"
              className="w-full border rounded px-4 py-2"
            />
            <ErrorMessage
              name="address"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            {submitLabel}
          </button>
        </Form>
      )}
    </Formik>
  );
}
