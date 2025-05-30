import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import goodsService from "../services/goods.service";
import GoodCard from "./GoodCard";

export default function Goods({ householdId }) {
  const [goods, setGoods] = useState([]);
  const navigate = useNavigate();

  const fetchGoods = useCallback(async () => {
    try {
      const data = await goodsService.getByHousehold(householdId);
      setGoods(data.goods);
    } catch (error) {
      console.error("Hiba a termékek betöltésekor:", error);
    }
  }, [householdId]);

  useEffect(() => {
    if (householdId) fetchGoods();
  }, [householdId, fetchGoods]);

  return (
    <div className="mt-10">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-semibold">Háztartáshoz tartozó termékek</h2>
      </div>

      {goods.length === 0 ? (
        <>
          <p className="text-center text-gray-500 italic mb-6">
            Nincs még egyetlen termék sem ebben a háztartásban.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate(`/good/new?householdId=${householdId}`)}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Új termék hozzáadása
            </button>
          </div>
        </>
      ) : (
        <>
          {/* <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {goods.map((good) => (
              <li
                key={good.id}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
              >
                <p className="font-medium text-gray-800">{good.name}</p>
                <p className="text-sm text-gray-500">Típus: {good.type}</p>
                <p className="text-sm text-gray-500">Állapot: {good.status}</p>
              </li>
            ))}
          </ul> */}

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {goods.map((good) => (
              <GoodCard
                key={good.id}
                good={good}
                onUpdate={() => fetchGoods()}
              />
            ))}
          </ul>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate(`/good/new?householdId=${householdId}`)}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Új termék hozzáadása
            </button>
          </div>
        </>
      )}
    </div>
  );
}
