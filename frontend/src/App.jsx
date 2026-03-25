import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

// Lazy load pages to reduce initial bundle size
const HomePage = React.lazy(() => import("./pages/HomePage"));
const AnalyzingPage = React.lazy(() => import("./pages/AnalyzingPage"));
const ResultPage = React.lazy(() => import("./pages/ResultPage"));
const HistoryPage = React.lazy(() => import("./pages/HistoryPage"));

export default function App() {
  return (
    <div className="flex min-h-screen bg-surface w-full overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 md:ml-64 w-full min-w-0 transition-all">
        <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><div className="w-8 h-8 rounded-full bg-primary animate-pulse-custom"></div></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyzing" element={<AnalyzingPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
