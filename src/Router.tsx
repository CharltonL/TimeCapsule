import { Routes, Route } from "react-router";
import { HomePage } from "./pages/Home";
import { TestPage2 } from "./pages/Page2";
import { Layout } from "./components/Layout";

export const Router = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="page2" element={<TestPage2 />} />
    </Route>
  </Routes>
);
