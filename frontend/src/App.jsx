import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/customer/Home";
import Advertisement from "./pages/customer/Advertisement";
import Subscription from "./pages/customer/Subscription";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserData from "./pages/admin/UserData"
import Koran from "./pages/admin/Koran"
import Iklan from "./pages/admin/Iklan"
import NewsData from "./pages/admin/NewsData"
import NewsUpload from "./pages/admin/NewsUpload"
import Settings from "./pages/admin/Settings"
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import CustomerLayout from "./layouts/CustomerLayout"
import NewsDetail from "./pages/customer/NewsDetail"

function App() {

  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={["customer", "admin"]}>
          <CustomerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="/:newsId" element={<NewsDetail />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="advertisement" element={<Advertisement />} />
      </Route>

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
        <Route path="berita/data" element={<NewsData />} />
        <Route path="berita/upload" element={<NewsUpload />} />
        <Route path="berita/upload/:id" element={<NewsUpload />} />
        <Route path="pengaturan" element={<Settings />} />
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Login />} />

    </Routes>
  )
}

export default App