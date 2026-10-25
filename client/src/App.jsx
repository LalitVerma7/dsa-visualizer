import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Topics from "./pages/Topics.jsx";
import AlgorithmPage from "./pages/AlgorithmPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DsaSheet from "./pages/DsaSheet";
import DsaSheetTopic from "./pages/DsaSheetTopic";
import DsaSheetQuestions from "./pages/DsaSheetQuestions";
import DsaSheetStatus from "./pages/DsaSheetStatus.jsx";
import AuthPage from "./pages/AuthPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/topics/:category/:slug" element={<AlgorithmPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <div className="mx-auto max-w-md px-6 py-24 text-center">
              <h1 className="font-display text-2xl font-semibold text-ink-50">Page not found</h1>
            </div>
          }
        />
        <Route path="/dsa-sheet" element={<DsaSheet />} />
        <Route path="/dsa-sheet/:topic" element={<DsaSheetTopic />} />
        <Route path="/dsa-sheet/:topic/:level" element={<DsaSheetQuestions />} />
        <Route path="/dsa-sheet/status/:status" element={<DsaSheetStatus />} />
      </Routes>
    </div>
  );
}
