import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import goodService from "../services/goods.service";
import EditGoodForm from "../components/EditGoodForm";

export default function EditGoodPage() {
  const { goodId } = useParams();
  const [good, setGood] = useState(null);

  useEffect(() => {
    const fetchGood = async () => {
      try {
        const data = await goodService.getById(goodId);
        setGood(data);
      } catch (error) {
        console.error("Hiba a termék betöltésekor:", error);
      }
    };

    if (goodId) fetchGood();
  }, [goodId]);

  if (!good) return <p className="text-center mt-10">Betöltés...</p>;

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 text-gray-800">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Termék módosítása
        </h1>
        <EditGoodForm good={good} />
      </div>
    </div>
  );
}
