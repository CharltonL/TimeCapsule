import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "maplibre-gl/dist/maplibre-gl.css";
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
