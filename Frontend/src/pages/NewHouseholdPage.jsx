// pages/NewHouseholdPage.jsx
import { useNavigate } from "react-router-dom";
import householdService from "../services/household.service";
import HouseholdForm from "../components/HouseholdForm";

export default function NewHouseholdPage() {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    address: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await householdService.createHousehold(values);
      resetForm();
      navigate("/");
    } catch (error) {
      console.error("Hiba a létrehozáskor:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 text-gray-800">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Új háztartás létrehozása
        </h1>
        <HouseholdForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Létrehozás"
        />
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:underline hover:text-black"
          >
            ← Vissza
          </button>
        </div>
      </div>
    </div>
  );
}
