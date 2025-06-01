import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DeleteGoodConfirmModal({ onCancel, onConfirm }) {
  const handleConfirm = async () => {
    try {
      await onConfirm(); // parent komponensből jövő async törlés
      toast.success("Termék sikeresen törölve!");
    } catch (error) {
      console.error(error);
      toast.error("Hiba történt a törlés során.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center space-y-4">
        <p className="text-lg font-semibold">Biztosan törlöd ezt a terméket?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Mégse
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Törlés megerősítése
          </button>
        </div>
      </div>
    </div>
  );
}
