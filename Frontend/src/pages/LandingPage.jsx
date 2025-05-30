import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

function LandingPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center text-center px-4 py-24 min-h-screen bg-gray-50 text-gray-800">
      <h2 className="text-4xl font-bold mb-4">Üdvözöl a ListTick!</h2>
      <p className="text-lg max-w-xl mb-8 text-gray-600">
        A ListTick egy modern háztartáskezelő alkalmazás, amellyel könnyedén nyomon
        követheted a közös bevásárlásokat, készleteket, lejárati időket és még
        sok mást is – több felhasználóra optimalizálva.
      </p>
      {!user && (
        <div>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-black text-white rounded-xl px-6 py-3 font-semibold hover:bg-gray-800 transition"
          >
            Bejelentkezés
          </button>
        </div>
      )}
    </main>
  );
}

export default LandingPage;
