import AppRoutes from "@/routes/AppRoutes";
import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/custom/Footer";
import 'leaflet/dist/leaflet.css';
import { useEffect } from "react";

function App() {
  useEffect(() => {
  console.log("App mounted");
}, []);

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
