import { useNavigate } from "react-router-dom";

export default function HouseholdCard({ household, currentUserId }) {
  const navigate = useNavigate();

  const isMember = household.users?.some((u) => u.id === currentUserId);
  const hasPendingRequest = isMember && household.reqUsers?.length > 0;

  // 🔍 új feltétel: van-e saját csatlakozási kérelmed ehhez a háztartáshoz?
  const hasMyJoinRequest =
    !isMember && household.reqUsers?.some((r) => r.user?.id === currentUserId);

  // 💡 class összeállítása logikusan
  const cardClass = `cursor-pointer border-2 rounded-xl p-4 shadow-md transition hover:shadow-lg ${
    isMember
      ? "border-green-500 bg-green-50"
      : hasMyJoinRequest
      ? "border-yellow-400 bg-yellow-50"
      : "border-gray-200 bg-white hover:border-gray-400"
  } ${hasPendingRequest ? "animate-wiggle-scale ring-2 ring-green-400" : ""}`;

  return (
    <div
      onClick={() => navigate(`/household/${household.id}`)}
      className={cardClass}
    >
      <h3 className="text-xl font-semibold text-gray-800">{household.name}</h3>
      {household.address && (
        <p className="text-gray-500">{household.address}</p>
      )}
    </div>
  );
}
