import { useNavigate } from "react-router-dom";
import NewHouseholdForm from "../components/NewHouseholdForm";

export default function NewHouseholdPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 text-gray-800">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Új háztartás létrehozása</h1>
        <NewHouseholdForm />
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
