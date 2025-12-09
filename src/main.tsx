import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router.tsx";

const basename = import.meta.env.MODE === "production" ? "/TimeCapsule" : "/";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={basename}>
    <StrictMode>
      <Router />
    </StrictMode>
  </BrowserRouter>
);
