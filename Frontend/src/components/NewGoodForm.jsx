import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import goodService from "../services/goods.service";

const validationSchema = Yup.object({
  name: Yup.string().required("Név megadása kötelező"),
  type: Yup.string().required("Típus kiválasztása kötelező"),
  status: Yup.string().required("Állapot kiválasztása kötelező"),
  expiration: Yup.string().optional(),
  shop: Yup.string().optional(),
  price: Yup.number().optional().typeError("Az árnak számnak kell lennie"),
});

export default function NewGoodForm({ householdId }) {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    type: "",
    status: "",
    expiration: "",
    shop: "",
    price: "",
    householdId: householdId || "", // ⬅️ Itt adjuk hozzá
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        ...values,
        price: values.price === "" ? undefined : parseInt(values.price, 10),
      };
      await goodService.createGood(payload);
      resetForm();
      navigate(`/household/${householdId}`);
    } catch (error) {
      console.error("Hiba a termék létrehozása során:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const types = [
    "fruit",
    "vegetable",
    "dairy",
    "meat",
    "baked",
    "cold_cuts",
    "snacks",
    "drinks",
    "other",
    "dry",
  ];

  const statuses = ["out", "quarter", "half", "threeQuarter", "full"];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6 bg-white p-6 rounded-xl shadow-md">
          <Field type="hidden" name="householdId" />
          <div>
            <label className="block font-semibold mb-1">Név *</label>
            <Field name="name" className="w-full border rounded px-4 py-2" />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Típus *</label>
            <Field
              as="select"
              name="type"
              className="w-full border rounded px-4 py-2"
            >
              <option value="">Válassz típust</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="type"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Állapot *</label>
            <Field
              as="select"
              name="status"
              className="w-full border rounded px-4 py-2"
            >
              <option value="">Válassz állapotot</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="status"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Lejárati idő</label>
            <Field
              name="expiration"
              className="w-full border rounded px-4 py-2"
              placeholder="pl. 2025-12-31"
            />
            <ErrorMessage
              name="expiration"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Bolt</label>
            <Field name="shop" className="w-full border rounded px-4 py-2" />
            <ErrorMessage
              name="shop"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Ár (Ft)</label>
            <Field
              name="price"
              type="number"
              className="w-full border rounded px-4 py-2"
            />
            <ErrorMessage
              name="price"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Mentés
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Vissza
          </button>
        </Form>
      )}
    </Formik>
  );
}
