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
import FamousSpotDetails from "@/pages/FamousSpotDetails";
import FamousFoodDetails from "@/pages/FamousFoodDetails";
import HandicraftDetails from "../pages/HandicraftDetails";
import HistoryDetails from "../pages/HistoryDetails";
import QuestionsHub from "@/pages/QuestionsHub";
import QuestionDetail from "@/pages/QuestionDetail";

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
      <Route path="/city/:stateName/:cityName" element={<CityLanding />} />

      <Route path="/city/:stateName/:cityName/famous-spots" element={<FamousSpots />} />
      <Route path="/famous-spot/:id" element={<FamousSpotDetails />} />
      <Route path="/famous-food/:id" element={<FamousFoodDetails />} />
      <Route path="/hidden-spot/:id" element={<FamousSpotDetails />} />
      <Route path="/handicraft/:id" element={<HandicraftDetails />} />
      <Route path="/history/:id" element={<HistoryDetails />} />
      <Route path="/city/:stateName/:cityName/hidden-spots" element={<HiddenSpots />} />
      <Route path="/city/:stateName/:cityName/famous-food" element={<FamousFoods />} />
      <Route path="/city/:stateName/:cityName/history" element={<History />} />
      <Route path="/city/:stateName/:cityName/handicrafts" element={<FamousHandicrafts />} />
      <Route path="/city/:stateName/:cityName/questions" element={<QuestionsHub />} />
      <Route path="/city/:stateName/:cityName/questions/:questionId" element={<QuestionDetail />} />
      <Route path="/city/:stateName/:cityName/locals" element={<InfoSection />} />

    </Routes>
  );
}
