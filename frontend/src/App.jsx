import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import InfoLotes from "./pages/InfoLotes";
import Admin from "./pages/Admin";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./context/ProtectedRoute";
import Docs from "./pages/Docs";
import Manuales from "./pages/Manuales";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/inicio" element={
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
