import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/pages/Login";
import InfoLotes from "./components/pages/InfoLotes";
import Dashboard from "./components/pages/Dashboard";
import Admin from "./components/pages/Admin";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Docs from "./components/pages/Docs";
import Manuales from "./components/pages/Manuales";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>} />
          <Route path="/lotes" element={
            <ProtectedRoute>
              <AppLayout>
                <InfoLotes />
              </AppLayout>
            </ProtectedRoute>} />
          <Route path="/documentos" element={
            <ProtectedRoute>
              <AppLayout>
                <Docs />
              </AppLayout>
            </ProtectedRoute>} />
          <Route path="/manuales" element={
            <ProtectedRoute>
              <AppLayout>
                <Manuales />
              </AppLayout>
            </ProtectedRoute>} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AppLayout>
                <Admin />
              </AppLayout>
            </ProtectedRoute>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
