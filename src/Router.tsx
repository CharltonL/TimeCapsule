import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { TestPage2 } from "./pages/Page2";
import { Layout } from "./components/Layout";
import MapExample from "./pages/Map";
import { Gallery } from "./pages/Gallery";
import { BuildingPage } from "./pages/BuildingPage";
import { NotesPage } from "./pages/Notes";

export const Router = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="gallery" element={<Gallery />} />
      <Route path="map" element={<MapExample />} />
      <Route path="360" element={<TestPage2 />} />
      <Route path="notes" element={<NotesPage />} />
      <Route path="building/:buildingId" element={<BuildingPage />} />
    </Route>
  </Routes>
);
