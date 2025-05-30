import goodService from "../services/goods.service";
import { useNavigate } from "react-router-dom";

export default function GoodCardModal({ good, onClose, onUpdate }) {
  const navigate = useNavigate();

  const statusOrder = ["out", "quarter", "half", "threeQuarter", "full"];

  const changeStatus = async (direction) => {
    const currentIndex = statusOrder.indexOf(good.status);
    const newIndex =
      direction === "up"
        ? Math.min(currentIndex + 1, statusOrder.length - 1)
        : Math.max(currentIndex - 1, 0);

    if (newIndex !== currentIndex) {
      await goodService.updateGood(good.id, {
        status: statusOrder[newIndex],
      });
      onUpdate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">{good.name}</h2>
        <p>
          <span className="font-medium">Típus:</span> {good.type}
        </p>
        <p>
          <span className="font-medium">Állapot:</span> {good.status}
        </p>
        <p>
          <span className="font-medium">Ár:</span> {good.price || "N/A"}
        </p>
        <p>
          <span className="font-medium">Bolt:</span> {good.shop || "N/A"}
        </p>
        <p>
          <span className="font-medium">Lejárat:</span>{" "}
          {good.expiration || "N/A"}
        </p>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => changeStatus("down")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            −
          </button>

          <button
            onClick={() => navigate(`/good/edit/${good.id}`)}
            className="text-blue-600 hover:underline font-medium"
          >
            Módosítás
          </button>

          <button
            onClick={() => changeStatus("up")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
