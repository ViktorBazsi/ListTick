import { useEffect, useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import householdService from "../services/household.service";
import goodService from "../services/goods.service";
import ShoppingListHouseholdCard from "./ShoppingListHouseholdCard";
import ShoppingListGoodCard from "./ShoppingListGoodCard";
import { toast } from "react-toastify";

export default function ShoppingList() {
  const { user } = useContext(AuthContext);
  const [households, setHouseholds] = useState([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState(null);
  const [allGoods, setAllGoods] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showQuarter, setShowQuarter] = useState(false);
  const [showHalf, setShowHalf] = useState(false);

  useEffect(() => {
    const fetchHouseholds = async () => {
      const data = await householdService.getMyHouseholds();
      setHouseholds(data);
    };
    if (user) fetchHouseholds();
  }, [user]);

  const fetchOutGoods = async (householdId) => {
    try {
      const data = await householdService.getById(householdId);
      setAllGoods(data.goods);
      setSelectedHouseholdId(householdId);
      setCartItems([]);
    } catch (error) {
      toast.error("Nem sikerült betölteni az árucikkeket.");
      console.error(error);
    }
  };

  const toggleCart = (id) => {
    setCartItems((prev) =>
      prev.includes(id) ? prev.filter((gid) => gid !== id) : [...prev, id]
    );
  };

  const handleBuy = async () => {
    try {
      await Promise.all(
        allGoods
          .filter((good) => cartItems.includes(good.id))
          .map((good) =>
            goodService.updateGood(good.id, {
              ...good,
              status: "full",
            })
          )
      );
      await fetchOutGoods(selectedHouseholdId);
      toast.success("A termékek státusza sikeresen frissítve!");
    } catch (error) {
      console.error("Nem sikerült frissíteni az árucikkeket:", error);
      toast.error("Hiba történt a frissítés során. Kérlek, próbáld újra!");
    }
  };

  const visibleGoods = allGoods.filter(
    (g) =>
      g.status === "out" ||
      (showQuarter && g.status === "quarter") ||
      (showHalf && g.status === "half")
  );

  const groupByStatus = (goods) => ({
    out: goods.filter((g) => g.status === "out"),
    quarter: goods.filter((g) => g.status === "quarter"),
    half: goods.filter((g) => g.status === "half"),
  });

  const grouped = groupByStatus(visibleGoods);

  return (
    <section className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-xl">
      {!selectedHouseholdId ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {households.map((hh) => (
            <ShoppingListHouseholdCard
              key={hh.id}
              household={hh}
              onClick={fetchOutGoods}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showQuarter}
                onChange={(e) => setShowQuarter(e.target.checked)}
                className=" w-4 h-4"
              />
              Negyedig
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showHalf}
                onChange={(e) => setShowHalf(e.target.checked)}
                className=" w-4 h-4"
              />
              Félig
            </label>
          </div>

          {grouped.out.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Elfogyott
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {grouped.out.map((good) => (
                  <ShoppingListGoodCard
                    key={good.id}
                    good={good}
                    inCart={cartItems.includes(good.id)}
                    onClick={() => toggleCart(good.id)}
                  />
                ))}
              </div>
            </>
          )}

          {showQuarter && grouped.quarter.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-2">
                Negyedig
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {grouped.quarter.map((good) => (
                  <ShoppingListGoodCard
                    key={good.id}
                    good={good}
                    inCart={cartItems.includes(good.id)}
                    onClick={() => toggleCart(good.id)}
                  />
                ))}
              </div>
            </>
          )}

          {showHalf && grouped.half.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-2">
                Félig
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {grouped.half.map((good) => (
                  <ShoppingListGoodCard
                    key={good.id}
                    good={good}
                    inCart={cartItems.includes(good.id)}
                    onClick={() => toggleCart(good.id)}
                  />
                ))}
              </div>
            </>
          )}

          {cartItems.length > 0 && (
            <div className="mt-10 text-center">
              <button
                onClick={handleBuy}
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition"
              >
                Megvettem
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
