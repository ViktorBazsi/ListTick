import { useSearchParams } from "react-router-dom";
import NewGoodForm from "../components/NewGoodForm";

export default function AddGoodPage() {
  const [searchParams] = useSearchParams();
  const householdId = searchParams.get("householdId");

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 text-gray-800">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Új termék hozzáadása
        </h1>
        <NewGoodForm householdId={householdId} />
      </div>
    </div>
  );
}
