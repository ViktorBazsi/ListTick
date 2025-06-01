import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import goodsService from "../services/goods.service";
import GoodCard from "./GoodCard";

const PAGE_SIZE = 6;

export default function Goods({ householdId }) {
  const navigate = useNavigate();

  const [goods, setGoods] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Aktív szűrők
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  // Inputként használt értékek
  const [inputSearch, setInputSearch] = useState("");
  const [inputStatus, setInputStatus] = useState("");
  const [inputType, setInputType] = useState("");

  const fetchGoods = useCallback(async () => {
    try {
      const result = await goodsService.getByHouseholdFiltered({
        householdId,
        page,
        pageSize: PAGE_SIZE,
        search,
        status,
        type,
      });
      setGoods(result.goods);
      setTotalCount(result.total);
    } catch (error) {
      console.error("Hiba a termékek betöltésekor:", error);
    }
  }, [householdId, page, search, status, type]);

  useEffect(() => {
    if (householdId) fetchGoods();
  }, [householdId, fetchGoods]);

  const handleSearch = () => {
    setPage(1); // lapozás reset
    setSearch(inputSearch.trim());
    setStatus(inputStatus);
    setType(inputType);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="mt-10">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-semibold">Háztartáshoz tartozó termékek</h2>
      </div>

      {/* Szűrők */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch justify-center mb-6 px-4">
        <input
          type="text"
          placeholder="Keresés név alapján..."
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border rounded-lg shadow-sm"
        />
        <select
          value={inputStatus}
          onChange={(e) => setInputStatus(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border rounded-lg shadow-sm"
        >
          <option value="">Termék mennyisége</option>
          <option value="out">Nincs</option>
          <option value="quarter">Negyed</option>
          <option value="half">Fél</option>
          <option value="threeQuarter">Háromnegyed</option>
          <option value="full">Tele</option>
        </select>
        <select
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border rounded-lg shadow-sm"
        >
          <option value="">Termék típusa</option>
          <option value="fruit">Gyümölcs</option>
          <option value="vegetable">Zöldség</option>
          <option value="dairy">Tejtermék</option>
          <option value="meat">Hús</option>
          <option value="baked">Péksütemény</option>
          <option value="cold_cuts">Feldolgozott hús</option>
          <option value="snacks">Snack</option>
          <option value="drinks">Ital</option>
          <option value="dry">Szárazáru</option>
          <option value="other">Egyéb</option>
          <option value="spice">Fűszer</option>
        </select>
        <button
          onClick={handleSearch}
          className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Keresés
        </button>
      </div>

      {/* Termékek száma */}
      <div className="text-center text-sm text-gray-600 mb-5">
        <span className="font-medium">Termékek száma:</span> {totalCount}
      </div>

      {/* Találatok */}
      {goods.length === 0 ? (
        <p className="text-center text-gray-500 italic mb-6">
          Nincs találat a megadott szűrőkre.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 px-4">
          {goods.map((good) => (
            <GoodCard key={good.id} good={good} onUpdate={fetchGoods} />
          ))}
        </ul>
      )}

      {/* Lapozás */}
      <div className="flex justify-center gap-4 mt-6 text-sm sm:text-base">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Előző
        </button>
        <span className="self-center font-medium">
          Oldal: {page} / {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Következő
        </button>
      </div>

      {/* Új termék hozzáadása */}
      <div className="flex justify-center mt-8 px-4">
        <button
          onClick={() => navigate(`/good/new?householdId=${householdId}`)}
          className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Új termék hozzáadása
        </button>
      </div>
    </div>
  );
}
