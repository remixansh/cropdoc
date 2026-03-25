import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AnalyzingPage from "./pages/AnalyzingPage";
import ResultPage from "./pages/ResultPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/analyzing" element={<AnalyzingPage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}
