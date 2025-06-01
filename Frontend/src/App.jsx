import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/AuthContext";

import Header from "./components/Header";

// PAGES
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import NewHouseholdPage from "./pages/NewHouseholdPage";
import HouseholdPage from "./pages/HouseholdPage";
import AddGoodPage from "./pages/AddGoodPage";
import EditGoodPage from "./pages/EditGoodPage";
import AllHouseholdsPage from "./pages/AllHousePage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/good/edit/:goodId" element={<EditGoodPage />} />
          <Route path="/good/new" element={<AddGoodPage />} />
          <Route path="/household/new" element={<NewHouseholdPage />} />
          <Route path="/households" element={<AllHouseholdsPage />} />
          <Route path="/household/:householdId" element={<HouseholdPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
