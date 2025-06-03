// pages/ShoppingListPage.jsx
import ShoppingList from "../components/ShoppingList";

export default function ShoppingListPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Bevásárlólista</h1>
      <ShoppingList />
    </main>
  );
}
