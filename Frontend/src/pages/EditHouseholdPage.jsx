// pages/EditHouseholdPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import householdService from "../services/household.service";
import HouseholdForm from "../components/HouseholdForm";
import { toast } from "react-toastify";

export default function EditHouseholdPage() {
  const { householdId } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await householdService.getById(householdId);
        setInitialValues({
          name: data.name || "",
          address: data.address || "",
        });
      } catch (error) {
        console.error("Hiba a háztartás lekérdezésekor:", error);
        toast.error("Nem sikerült betölteni a háztartást.");
      }
    };
    fetchData();
  }, [householdId]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await householdService.updateHousehold(householdId, values);
      toast.success("Háztartás frissítve.");
      navigate(`/household/${householdId}`);
    } catch (error) {
      console.error("Hiba frissítéskor:", error);
      toast.error("Nem sikerült frissíteni a háztartást.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues) return <p>Betöltés...</p>;

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 text-gray-800">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Háztartás szerkesztése
        </h1>
        <HouseholdForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Mentés"
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
