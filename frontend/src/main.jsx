import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ScrollToTop from "@/components/custom/ScrollToTop"; // optional but useful
import { AuthProvider } from "./context/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop /> {/* ensures each route loads from top */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
