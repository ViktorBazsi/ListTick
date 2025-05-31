import { useEffect, useState, useContext, useCallback } from "react";
import householdService from "../services/household.service";
import Goods from "./Goods";
import AuthContext from "../contexts/AuthContext";
import RequestCard from "./RequestCard";

export default function Household({ householdId }) {
  const [household, setHousehold] = useState(null);
  const [joinStatus, setJoinStatus] = useState("loading"); // "joined" | "requested" | "none"
  const { user } = useContext(AuthContext); // feltételezve, hogy authUser.id elérhető

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
      }); // optimista frissítés
    } catch (err) {
      console.error("Hiba csatlakozás közben:", err);
    }
  };

  if (!household) return <p>Betöltés...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{household.name}</h1>
      {household.address && (
        <p className="text-gray-600">{household.address}</p>
      )}

      {/* 🔘 Csatlakozás logika */}
      <div className="mt-4">
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Csatlakozás
          </button>
        )}
      </div>

      {/* 👥 Tagok */}
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

      {household.reqUsers?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">
            Csatlakozási kérelmek:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {household.reqUsers
              .filter((r) => r.user) // csak akkor map-elünk, ha van user
              .map((req) => (
                <RequestCard
                  key={req.user.id}
                  user={{ ...req.user, createdAt: req.createdAt }}
                  householdId={household.id}
                  onApprove={(approvedUserId) => {
                    // távolítsuk el a sikeresen jóváhagyott usert a reqUsers-ből
                    setHousehold((prev) => ({
                      ...prev,
                      reqUsers: prev.reqUsers.filter(
                        (r) => r.user.id !== approvedUserId
                      ),
                      users: [...prev.users, req.user], // opcionálisan hozzáadhatod
                    }));
                  }}
                />
              ))}
          </div>
        </div>
      )}

      {/* 📦 Termékek */}
      <div>
        {household.goods ? (
          <Goods householdId={householdId} />
        ) : (
          <p className="text-red-600 italic font-semibold">
            {household.message}
          </p>
        )}
      </div>
    </div>
  );
}
