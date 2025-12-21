// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import SheherJaanoLanding from "@/pages/SheherJaanoLanding";
import Contribute from "@/pages/Contribute";
import FamousSpotsForm from "@/pages/FamousSpotsForm";
import HiddenSpotsForm from "@/pages/HiddenSpotsForm";
import FamousFoodsForm from "@/pages/FamousFoodsForm";
import HistoryForm from "@/pages/HistoryForm";
import HandicraftsForm from "@/pages/HandicraftsForm";
import YourInfoForm from "@/pages/YourInfoForm";
import CityLanding from "@/pages/CityLanding";
import FamousSpots from "../pages/FamousSpots";
import HiddenSpots from "../pages/HiddenSpots";
import FamousFoods from "../pages/FamousFoods";
import History from "../pages/History";
import FamousHandicrafts from "../pages/Handicrafts";
import InfoSection from "../pages/InfoSection";
import Register from "@/pages/Register";
import SignIn from "@/pages/SignIn";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<SheherJaanoLanding />} />

      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<SignIn />} />

      {/* Contribute Routes */}
      <Route element={<ProtectedRoute />}>

      <Route path="/contribute" element={<Contribute />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/contribute/famous-spots" element={<FamousSpotsForm />} />
      <Route path="/contribute/hidden-spots" element={<HiddenSpotsForm />} />
      <Route path="/contribute/famous-foods" element={<FamousFoodsForm />} />
      <Route path="/contribute/history" element={<HistoryForm />} />
      <Route path="/contribute/handicrafts" element={<HandicraftsForm />} />
      <Route path="/contribute/your-info" element={<YourInfoForm />} />
      </Route>

      {/* Dynamic City Route */}
      <Route path="/city/:cityName" element={<CityLanding />} />

      <Route path="/city/:cityName/famous-spots" element={<FamousSpots />} />
      <Route path="/city/:cityName/hidden-spots" element={<HiddenSpots />} />
      <Route path="/city/:cityName/famous-foods" element={<FamousFoods />} />
      <Route path="/city/:cityName/history" element={<History />} />
      <Route path="/city/:cityName/handicrafts" element={<FamousHandicrafts />} />
      <Route path="/city/:cityName/locals" element={<InfoSection />} />

    </Routes>
  );
}
