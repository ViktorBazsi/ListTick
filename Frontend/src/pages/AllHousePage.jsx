import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import householdService from "../services/household.service";
import Household from "../components/Household";

const PAGE_SIZE = 2;

export default function AllHouseholdsPage() {
  const [households, setHouseholds] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState(""); // ez van a mezőben
  const [searchTerm, setSearchTerm] = useState(""); // ez kerül a lekérésbe
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const { data, totalCount } = await householdService.getAll(
        page,
        PAGE_SIZE,
        searchTerm
      );
      setHouseholds(data);
      setTotalCount(totalCount);
    } catch (error) {
      console.error("Nem sikerült lekérni a háztartásokat:", error);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    setPage(1); // keresés újraindítja az oldalszámot
    setSearchTerm(inputValue.trim());
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 sm:p-10 space-y-10">
        <h1 className="text-3xl font-bold text-center">Összes háztartás</h1>

        {/* 🔍 Keresőmező + gomb */}
        <div className="flex justify-center gap-4">
          <input
            type="text"
            placeholder="Keresés név alapján..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-black text-white rounded-xl px-6 py-3 font-semibold hover:bg-gray-800 transition"
          >
            Keresés
          </button>
        </div>

        {/* 📋 Lista */}
        {households.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            Nincs találat a megadott keresésre.
          </p>
        ) : (
          households.map((h) => (
            <div
              key={h.id}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50"
            >
              <Household householdId={h.id} />
            </div>
          ))
        )}

        {/* 🔁 Lapozás */}
        <div className="flex justify-between items-center pt-4">
          <button
            disabled={!hasPrev}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Előző
          </button>

          <span className="text-gray-600">
            Oldal: {page} / {totalPages || 1}
          </span>

          <button
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Következő
          </button>
        </div>

        {/* 🔙 Vissza gomb */}
        <div className="text-center pt-6">
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
