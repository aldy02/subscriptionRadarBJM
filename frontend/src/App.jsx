import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserData from "./pages/admin/UserData"
import Koran from "./pages/admin/Koran"
import Iklan from "./pages/admin/Iklan"
import ArtikelData from "./pages/admin/ArtikelData"
import ArtikelUpload from "./pages/admin/ArtikelUpload"
import Settings from "./pages/admin/Settings"
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

function App() {

  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute allowedRoles={["subscriber", "non-subscriber", "admin"]}>
          <Home />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }>

        {/* Default Admin Page */}
        <Route index element={<AdminDashboard />} />
        <Route path="data-user" element={<UserData />} />
        <Route path="koran" element={<Koran />} />
        <Route path="iklan" element={<Iklan />} />
        <Route path="artikel/data" element={<ArtikelData />} />
        <Route path="artikel/upload" element={<ArtikelUpload />} />
        <Route path="pengaturan" element={<Settings />} />
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Login />} />

    </Routes>
  )
}

export default App
