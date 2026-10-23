
import { Navigate, Route, Routes } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Default page */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Register page */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Login page */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Protected dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Invalid URL */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
