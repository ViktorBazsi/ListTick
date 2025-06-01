import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center text-center px-4 py-24 min-h-screen bg-gray-50 text-gray-800">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-900">
          Bejelentkezés
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
