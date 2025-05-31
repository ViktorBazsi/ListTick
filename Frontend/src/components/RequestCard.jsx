import { useState } from "react";
import householdService from "../services/household.service";

export default function RequestCard({
  user,
  householdId,
  onApprove,
  onReject,
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await householdService.approveUser(householdId, user.id);
      onApprove(user.id); // törlés a listából, vagy újratöltés
    } catch (err) {
      console.error("Hiba a jóváhagyás során:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await householdService.rejectUser(householdId, user.id);
      onReject(user.id);
    } catch (err) {
      console.error("Hiba elutasítás közben:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2">
      <div>
        <p className="font-semibold text-lg">
          {user.firstName} {user.lastName} ({user.username})
        </p>
        <p className="text-gray-600 text-sm">{user.email}</p>
        <p className="text-gray-400 text-xs">
          Jelentkezett: {new Date(user.createdAt).toLocaleString("hu-HU")}
        </p>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleApprove}
          disabled={isProcessing}
          className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition disabled:opacity-50"
        >
          Jóváhagyás
        </button>
        <button
          onClick={handleReject}
          disabled={isProcessing}
          className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition disabled:opacity-50"
        >
          Elutasítás
        </button>
      </div>
    </div>
  );
}
