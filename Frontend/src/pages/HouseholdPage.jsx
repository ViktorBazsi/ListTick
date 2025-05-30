import { useParams, useNavigate } from "react-router-dom";
import Household from "../components/Household";

export default function HouseholdPage() {
  const { householdId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 sm:p-10 space-y-10">
        <Household householdId={householdId} />

        <div className="text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Vissza
          </button>
        </div>
      </div>
    </div>
  );
}
