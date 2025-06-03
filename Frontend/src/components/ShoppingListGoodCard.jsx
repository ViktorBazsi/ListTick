// components/ShoppingListGoodCard.jsx

export default function ShoppingListGoodCard({ good, inCart, onClick }) {
  // Színezés státusz alapján
  let bgClass = "";
  let borderClass = "";

  switch (good.status) {
    case "out":
      bgClass = inCart ? "bg-green-100" : "bg-red-300";
      borderClass = inCart ? "border-green-500" : "border-red-500";
      break;
    case "quarter":
      bgClass = inCart ? "bg-green-100" : "bg-red-200";
      borderClass = inCart ? "border-green-500" : "border-red-300";
      break;
    case "half":
      bgClass = inCart ? "bg-green-100" : "bg-red-100";
      borderClass = inCart ? "border-green-500" : "border-gray-300";
      break;
    default:
      bgClass = "bg-white";
      borderClass = "border-gray-300";
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer shadow-sm transition-all border ${bgClass} ${borderClass}`}
    >
      {/* Dekoratív checkbox */}
      <div
        className={`w-5 h-5 mt-1 rounded-sm border-2 flex items-center justify-center transition-all
          ${
            inCart
              ? "border-green-600 bg-green-600 text-white"
              : "border-gray-400 bg-white"
          }
        `}
      >
        {inCart && (
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Termék adatok */}
      <div>
        <h3 className="text-base font-semibold text-gray-800">{good.name}</h3>
        {good.shop && (
          <p className="text-sm text-gray-500 italic">{good.shop}</p>
        )}
      </div>
    </div>
  );
}
