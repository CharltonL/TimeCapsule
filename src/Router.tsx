import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { TestPage2 } from "./pages/Page2";
import { Layout } from "./components/Layout";

export const Router = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="360" element={<TestPage2 />} />
    </Route>
  </Routes>
);
