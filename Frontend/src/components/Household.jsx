import { useEffect, useState, useContext, useCallback } from "react";
import householdService from "../services/household.service";
import Goods from "./Goods";
import AuthContext from "../contexts/AuthContext";
import RequestCard from "./RequestCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "./ConfirmModal"; // új modal

export default function Household({ householdId }) {
  const [household, setHousehold] = useState(null);
  const [joinStatus, setJoinStatus] = useState("loading"); // "joined" | "requested" | "none"
  const { user } = useContext(AuthContext);
  const [confirmData, setConfirmData] = useState(null); // { type: "leave" | "delete", onConfirm: fn }

  const fetchHousehold = useCallback(async () => {
    try {
      const data = await householdService.getById(householdId);
      setHousehold(data);

      const isMember = data.users.some((u) => u.id === user.id);
      const request = data.reqUsers?.find((r) => r.user?.id === user.id);

      if (isMember) {
        setJoinStatus("joined");
      } else if (request) {
        setJoinStatus({ status: "requested", createdAt: request.createdAt });
      } else {
        setJoinStatus("none");
      }
    } catch (error) {
      console.error("Hiba a háztartás betöltésekor:", error);
    }
  }, [householdId, user.id]);

  useEffect(() => {
    if (householdId) {
      fetchHousehold();
    }
  }, [householdId, fetchHousehold]);

  const handleJoin = async () => {
    try {
      await householdService.joinHousehold(householdId);
      setJoinStatus({
        status: "requested",
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Hiba csatlakozás közben:", err);
    }
  };

  const handleApprove = (approvedUserId) => {
    setHousehold((prev) => {
      const approvedReq = prev.reqUsers.find(
        (r) => r.user.id === approvedUserId
      );
      return {
        ...prev,
        reqUsers: prev.reqUsers.filter((r) => r.user.id !== approvedUserId),
        users: approvedReq ? [...prev.users, approvedReq.user] : prev.users,
      };
    });
  };

  const handleReject = (rejectedUserId) => {
    setHousehold((prev) => ({
      ...prev,
      reqUsers: prev.reqUsers.filter((r) => r.user.id !== rejectedUserId),
    }));
  };

  if (!household) return <p>Betöltés...</p>;

  const isMember = joinStatus === "joined";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{household.name}</h1>
      {household.address && (
        <p className="text-gray-600">{household.address}</p>
      )}

      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Tagok</h2>
        <ul className="list-disc list-inside">
          {household.users.map((user) => (
            <li key={user.id}>
              {user.firstName} {user.lastName} ({user.username})
            </li>
          ))}
        </ul>
      </div>

      {isMember && (
        <div className="mt-2">
          <button
            onClick={() =>
              (window.location.href = `/household/${household.id}/edit`)
            }
            className=" bg-black text-white rounded-xl px-6 py-3 font-semibold hover:bg-gray-800 transition"
          >
            Háztartás szerkesztése
          </button>
        </div>
      )}

      {isMember && household.reqUsers?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">
            Csatlakozási kérelmek:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {household.reqUsers
              .filter((r) => r.user)
              .map((req) => (
                <RequestCard
                  key={req.user.id}
                  user={{ ...req.user, createdAt: req.createdAt }}
                  householdId={household.id}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
          </div>
        </div>
      )}

      <div>
        {household.goods ? (
          <Goods householdId={householdId} />
        ) : (
          <p className="text-red-600 italic font-semibold">
            {household.message}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center justify-center space-y-4 text-center">
        {joinStatus === "joined" && (
          <p className="text-green-600 font-semibold">
            Már tagja vagy ennek a háztartásnak.
          </p>
        )}

        {joinStatus?.status === "requested" && (
          <p className="text-yellow-600">
            Csatlakozási kérelem elküldve –{" "}
            {new Date(joinStatus.createdAt).toLocaleString("hu-HU")}
          </p>
        )}

        {joinStatus === "none" && (
          <button
            onClick={handleJoin}
            className="bg-black text-white rounded-xl px-6 py-3 font-semibold hover:bg-gray-800 transition"
          >
            Csatlakozás
          </button>
        )}

        {joinStatus === "joined" && (
          <div className="mt-10">
            <button
              onClick={() => {
                const isLastUser =
                  household.users.length === 1 &&
                  household.users[0].id === user.id;

                if (isLastUser) {
                  setConfirmData({
                    type: "delete",
                    message:
                      "Te vagy az utolsó tag. Törölni szeretnéd a háztartást?",
                    onConfirm: async () => {
                      try {
                        await householdService.deleteHousehold(household.id);
                        toast.success("Háztartás törölve.");
                        setTimeout(() => {
                          window.location.href = "/";
                        }, 1500);
                      } catch (err) {
                        console.error("Hiba törléskor:", err);
                        toast.error("Nem sikerült törölni a háztartást.");
                      }
                    },
                  });
                } else {
                  setConfirmData({
                    type: "leave",
                    message: "Biztosan elhagyod a háztartást?",
                    onConfirm: async () => {
                      try {
                        await householdService.leaveHousehold(household.id);
                        toast.success("Sikeresen elhagytad a háztartást.");
                        setTimeout(() => {
                          window.location.href = "/";
                        }, 1500);
                      } catch (err) {
                        console.error("Hiba elhagyáskor:", err);
                        toast.error("Nem sikerült elhagyni a háztartást.");
                      }
                    },
                  });
                }
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
            >
              Háztartás elhagyása
            </button>
          </div>
        )}
      </div>

      {confirmData && (
        <ConfirmModal
          isOpen={!!confirmData}
          onClose={() => setConfirmData(null)}
          onConfirm={confirmData.onConfirm}
          message={confirmData.message}
        />
      )}
    </div>
  );
}
