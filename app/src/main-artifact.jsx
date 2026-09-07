// Titik masuk untuk terbitan satu fail. Sama seperti main.jsx tetapi tanpa
// pendaftaran pekerja perkhidmatan, sebab terbitan itu bukan PWA.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { StoreProvider } from "./lib/store.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>
);
