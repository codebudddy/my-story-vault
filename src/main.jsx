import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";

//global variables
import { FirebaseProvider } from "./context/FirebaseContext"; //
import { AuthContextProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </AuthContextProvider>
  </StrictMode>
);
