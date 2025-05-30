import { useNavigate } from "react-router-dom";

export default function HouseholdCard({ household }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/household/${household.id}`)}
      className="cursor-pointer border rounded-xl p-4 shadow-md bg-white hover:shadow-lg hover:border-gray-400 transition"
    >
      <h3 className="text-xl font-semibold text-gray-800">{household.name}</h3>
      {household.address && (
        <p className="text-gray-500">{household.address}</p>
      )}
    </div>
  );
}
