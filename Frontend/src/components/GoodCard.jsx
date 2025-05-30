import { useState } from "react";
import classNames from "classnames";
import goodService from "../services/goods.service";
import GoodCardModal from "./GoodCardModal";

export default function GoodCard({ good, onUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusColors = {
    full: "bg-green-400",
    threeQuarter: "bg-green-200",
    half: "bg-neutral-100",
    quarter: "bg-red-100",
    out: "bg-red-400",
  };

  const statusOrder = ["out", "quarter", "half", "threeQuarter", "full"];

  const incrementStatus = async (e) => {
    e.stopPropagation();
    const currentIndex = statusOrder.indexOf(good.status);
    if (currentIndex < statusOrder.length - 1) {
      const newStatus = statusOrder[currentIndex + 1];
      await goodService.updateGood(good.id, { status: newStatus });
      onUpdate();
    }
  };

  const decrementStatus = async (e) => {
    e.stopPropagation();
    const currentIndex = statusOrder.indexOf(good.status);
    if (currentIndex > 0) {
      const newStatus = statusOrder[currentIndex - 1];
      await goodService.updateGood(good.id, { status: newStatus });
      onUpdate();
    }
  };

  return (
    <>
      <div
        className={classNames(
          "border rounded-xl p-4 shadow-sm transition-all duration-200",
          "hover:shadow-lg hover:ring-1 hover:ring-gray-300 cursor-pointer",
          statusColors[good.status]
        )}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{good.name}</p>
            <p className="text-sm text-gray-700">Típus: {good.type}</p>
            <p className="text-sm text-gray-700">Állapot: {good.status}</p>
            <div className="mt-auto text-sm italic text-right text-gray-800 pt-2">
              Részletekért kattints a kártyára!
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <button
              onClick={incrementStatus}
              className="bg-green-500 text-white px-2 rounded hover:bg-green-600"
            >
              +
            </button>
            <button
              onClick={decrementStatus}
              className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
            >
              –
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <GoodCardModal
          good={good}
          onClose={() => setIsModalOpen(false)}
          onUpdate={() => {
            setIsModalOpen(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
}
