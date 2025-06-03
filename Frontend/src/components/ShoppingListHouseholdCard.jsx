// components/SelectableHouseholdCard.jsx
export default function ShoppingListHouseholdCard({ household, onClick }) {
  return (
    <div
      className="border p-4 rounded-lg shadow hover:bg-gray-100 cursor-pointer transition"
      onClick={() => onClick(household.id)}
    >
      <h3 className="text-lg font-semibold">{household.name}</h3>
      {household.address && (
        <p className="text-sm text-gray-600">{household.address}</p>
      )}
    </div>
  );
}
