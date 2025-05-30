import RegistrationForm from "../components/RegistrationForm";

export default function RegistrationPage() {
  return (
    <main className="pt-24 min-h-screen bg-gray-50 text-gray-800 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-900">
          Fiók létrehozása
        </h1>
        <RegistrationForm />
      </div>
    </main>
  );
}
