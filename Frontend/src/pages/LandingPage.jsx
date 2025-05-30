import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import HouseholdCard from "../components/HouseholdCard";
import householdService from "../services/household.service";

function LandingPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [households, setHouseholds] = useState([]);

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        const data = await householdService.getMyHouseholds();
        setHouseholds(data);
      } catch (error) {
        console.error("Hiba a háztartások betöltésekor:", error);
      }
    };

    if (user) {
      fetchHouseholds();
    }
  }, [user]);

  return (
    <main className="flex flex-col items-center justify-center text-center px-4 py-24 min-h-screen bg-gray-50 text-gray-800">
      <h2 className="text-4xl font-bold mb-4">Üdvözöl a ListTick!</h2>
      <p className="text-lg max-w-xl mb-8 text-gray-600">
        A ListTick egy modern háztartáskezelő alkalmazás, amellyel könnyedén
        nyomon követheted a közös bevásárlásokat, készleteket, lejárati időket
        és még sok mást is – több felhasználóra optimalizálva.
      </p>

      {!user ? (
        <div>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-black text-white rounded-xl px-6 py-3 font-semibold hover:bg-gray-800 transition"
          >
            Bejelentkezés
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          <button
            onClick={() => navigate("/household/new")}
            className="w-full bg-green-600 text-white rounded-xl px-6 py-3 font-semibold hover:bg-green-700 transition mb-8"
          >
            Új háztartás létrehozása
          </button>

          <h2 className="text-2xl font-bold mb-4">Háztartásaid:</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {households.map((household) => (
              <HouseholdCard key={household.id} household={household} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default LandingPage;
