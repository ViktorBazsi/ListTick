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

export default function EditGoodForm({ good }) {
  const navigate = useNavigate();

  const initialValues = {
    name: good.name || "",
    type: good.type || "",
    status: good.status || "",
    expiration: good.expiration || "",
    shop: good.shop || "",
    price: good.price || "",
    householdId: good.householdId || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        ...values,
        price: values.price === "" ? undefined : parseInt(values.price, 10),
      };
      await goodService.updateGood(good.id, payload);
      navigate(`/household/${good.householdId}`);
    } catch (error) {
      console.error("Hiba a termék módosításakor:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const types = [
    { value: "fruit", label: "Gyümölcs" },
    { value: "vegetable", label: "Zöldség" },
    { value: "dairy", label: "Tejtermék" },
    { value: "meat", label: "Hús" },
    { value: "baked", label: "Péksütemény" },
    { value: "cold_cuts", label: "Feldolgozott hús" },
    { value: "snacks", label: "Snack" },
    { value: "drinks", label: "Ital" },
    { value: "dry", label: "Szárazáru" },
    { value: "spice", label: "Fűszer" },
    { value: "other", label: "Egyéb" },
  ];

  const statuses = [
    { value: "out", label: "Nincs" },
    { value: "quarter", label: "Negyed" },
    { value: "half", label: "Fél" },
    { value: "threeQuarter", label: "Háromnegyed" },
    { value: "full", label: "Tele" },
  ];

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
              {types.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
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
              {statuses.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
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
