import { useEffect, useState } from "react";
import householdService from "../services/household.service";
import Goods from "./Goods";

export default function Household({ householdId }) {
  const [household, setHousehold] = useState(null);

  useEffect(() => {
    const fetchHousehold = async () => {
      try {
        const data = await householdService.getById(householdId);
        setHousehold(data);
      } catch (error) {
        console.error("Hiba a háztartás betöltésekor:", error);
      }
    };

    if (householdId) {
      fetchHousehold();
    }
  }, [householdId]);

  if (!household) return <p>Betöltés...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{household.name}</h1>
      {household.address && (
        <p className="text-gray-600">{household.address}</p>
      )}

      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Tagok</h2>
        <ul className="list-disc list-inside">
          {household.users.map((user) => (
            <li key={user.id}>
              {user.firstName} {user.lastName} ({user.username})
            </li>
          ))}
        </ul>
      </div>

      {/* <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Termékek</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {household.goods.map((good) => (
            <li
              key={good.id}
              className="border p-3 rounded-lg bg-white shadow-sm"
            >
              <p className="font-medium">{good.name}</p>
              <p className="text-sm text-gray-500">Típus: {good.type}</p>
              <p className="text-sm text-gray-500">Állapot: {good.status}</p>
            </li>
          ))}
        </ul>
      </div> */}
      <Goods householdId={householdId} />
    </div>
  );
}
