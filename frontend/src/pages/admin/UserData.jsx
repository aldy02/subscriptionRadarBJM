import { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, Search, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { getUsers, updateUser, deleteUser, createUser } from "../../api/userApi";

export default function UserData() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // State modal edit
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "customer",
    password: "",
  });

  // State modal delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // State modal success/error
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultType, setResultType] = useState('');
  const [resultMessage, setResultMessage] = useState('');

  // Get user data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers(page, limit, search);
      setUsers(response.data.data);
      setTotalPages(Math.ceil(response.data.total / limit));
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  // Show result modal
  const showResult = (type, message) => {
    setResultType(type);
    setResultMessage(message);
    setIsResultOpen(true);

    // Auto close after 3 seconds
    setTimeout(() => {
      setIsResultOpen(false);
    }, 3000);
  };

  // Delete user
  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(userToDelete.id);
      showResult('success', 'User berhasil dihapus');
      fetchUsers();
      setIsDeleteOpen(false);
      setUserToDelete(null);
    } catch (error) {
      showResult('error', 'Gagal menghapus user');
      setIsDeleteOpen(false);
    }
  };

  const handleAdd = async () => {
    try {
      await createUser(newUser);
      showResult("success", "User berhasil ditambahkan");
      fetchUsers();
      setIsAddOpen(false);
      setNewUser({ name: "", email: "", phone: "", address: "", role: "customer" });
    } catch (error) {
      showResult("error", error.response?.data?.message || "Gagal menambah user");
    }
  };

  // Open modal edit
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  // Save user changes
  const handleSave = async () => {
    try {
      await updateUser(selectedUser.id, selectedUser);
      showResult('success', 'Data user berhasil diperbarui');
      fetchUsers();
      setIsEditOpen(false);
    } catch (error) {
      showResult('error', error.response?.data?.message || 'Gagal memperbarui user');
    }
  };

  // Function get color for role badge
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "customer":
        return "bg-gray-50 text-gray-600 border border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:ml-0">
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 lg:mb-6">
              <div>
                <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">List Data Pengguna</h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">
                  Kelola data pengguna dan hak role mereka disini
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Search */}
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             bg-white text-sm outline-none transition-all duration-200"
                />
              </div>
              
              {/* Button Add User */}
              <button
                onClick={() => setIsAddOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm w-full sm:w-auto"
              >
                <Plus size={18} />
                <span className="text-sm lg:text-base">Tambah</span>
              </button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alamat
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No HP
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-center py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
                          <span className="text-gray-500 text-sm">Loading users...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <div className="text-gray-500">
                          <p className="text-lg font-medium">Pengguna tidak ditemukan</p>
                          <p className="text-sm mt-1">Coba perbaiki parameter pencarian anda</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={`http://localhost:5000/uploads/${user.profile_photo || "default.jpg"}`}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {user.address || <span className="text-gray-400">-</span>}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600">
                            {user.phone || <span className="text-gray-400">-</span>}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}
                          >
                            {user.role === 'admin' ? 'Admin' : 'Customer'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center items-center gap-1">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Desktop Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing {users.length} of {users.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1 || totalPages <= 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }, (_, i) => {
                    const pageNum = i + 1;
                    const isActive = page === pageNum;
                    const isDisabled = pageNum > totalPages;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => !isDisabled && setPage(pageNum)}
                        disabled={isDisabled}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                          ? 'bg-indigo-600 text-white'
                          : isDisabled
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page >= totalPages || totalPages <= 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
                  <span className="text-gray-500 text-sm">Loading users...</span>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="text-gray-500">
                  <p className="text-lg font-medium">Pengguna tidak ditemukan</p>
                  <p className="text-sm mt-1">Coba perbaiki parameter pencarian anda</p>
                </div>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
                >
                  {/* User Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={`http://localhost:5000/uploads/${user.profile_photo || "default.jpg"}`}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm truncate">{user.name}</h3>
                          <p className="text-xs text-gray-600 truncate mt-0.5">{user.email}</p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getRoleBadge(user.role)}`}
                        >
                          {user.role === 'admin' ? 'Admin' : 'Customer'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Alamat:</span>
                      <span className="text-gray-700 text-right flex-1 ml-2 truncate">
                        {user.address || <span className="text-gray-400">-</span>}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">No HP:</span>
                      <span className="text-gray-700">
                        {user.phone || <span className="text-gray-400">-</span>}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Mobile Pagination */}
            {users.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1 || totalPages <= 1}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      const isActive = page === pageNum;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page >= totalPages || totalPages <= 1}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Tambah User */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Tambah User</h2>
                  <p className="text-sm text-gray-600 mt-1">Masukkan informasi user baru</p>
                </div>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-full transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              focus:outline-none bg-gray-50 focus:bg-white
              text-sm transition-all duration-200"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              focus:outline-none bg-gray-50 focus:bg-white
              text-sm transition-all duration-200"
                    placeholder="Masukkan alamat email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              focus:outline-none bg-gray-50 focus:bg-white
              text-sm transition-all duration-200"
                    placeholder="Masukkan password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">No Handphone</label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              focus:outline-none bg-gray-50 focus:bg-white
              text-sm transition-all duration-200"
                    placeholder="Masukkan no handphone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                  <textarea
                    value={newUser.address}
                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              focus:outline-none bg-gray-50 focus:bg-white
              text-sm transition-all duration-200"
                    placeholder="Masukkan alamat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div className="relative">
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                focus:outline-none bg-gray-50 focus:bg-white
                text-sm transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsAddOpen(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                Batal
              </button>
              <button
                onClick={handleAdd}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit User */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
                  <p className="text-sm text-gray-600 mt-1">Update informasi dan role pengguna</p>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-full transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
              {selectedUser && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={selectedUser.name}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      focus:outline-none bg-gray-50 focus:bg-white
                      text-sm transition-all duration-200"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      focus:outline-none bg-gray-50 focus:bg-white
                      text-sm transition-all duration-200"
                      placeholder="Masukkan alamat email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No Handphone
                    </label>
                    <input
                      type="text"
                      value={selectedUser.phone || ""}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      focus:outline-none bg-gray-50 focus:bg-white
                      text-sm transition-all duration-200"
                      placeholder="Masukkan no handphone"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat
                    </label>
                    <textarea
                      value={selectedUser.address || ""}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, address: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      focus:outline-none bg-gray-50 focus:bg-white
                      text-sm transition-all duration-200"
                      placeholder="Masukkan alamat"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <div className="relative">
                      <select
                        value={selectedUser.role}
                        onChange={(e) =>
                          setSelectedUser({ ...selectedUser, role: e.target.value })
                        }
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        focus:outline-none bg-gray-50 focus:bg-white
                        text-sm transition-all duration-200 appearance-none cursor-pointer"
                      >
                        <option value="admin">Admin</option>
                        <option value="customer">Customer</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation */}
      {isDeleteOpen && userToDelete && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Konfirmasi Hapus</h2>
                  <p className="text-sm text-gray-600 mt-1">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <div className="text-center">
                <div className="mb-4">
                  <img
                    src={`http://localhost:5000/uploads/${userToDelete.profile_photo || "default.jpg"}`}
                    alt={userToDelete.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 mx-auto"
                  />
                </div>
                <p className="text-gray-700 mb-2">
                  Apakah Anda yakin ingin menghapus user:
                </p>
                <p className="font-semibold text-gray-900 text-lg mb-1">
                  {userToDelete.name}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  {userToDelete.email}
                </p>
                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  Data yang sudah dihapus tidak dapat dikembalikan!
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteOpen(false);
                  setUserToDelete(null);
                }}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Result (Success/Error) */}
      {isResultOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-sm overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Modal Body */}
            <div className="px-6 py-8 text-center">
              <div className="mb-4">
                {resultType === 'success' ? (
                  <div className="p-3 bg-green-100 rounded-full w-fit mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                ) : resultType === 'error' ? (
                  <div className="p-3 bg-red-100 rounded-full w-fit mx-auto">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                ) : (
                  <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto">
                    <AlertTriangle className="w-8 h-8 text-blue-600" />
                  </div>
                )}
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${resultType === 'success' ? 'text-green-700' :
                resultType === 'error' ? 'text-red-700' : 'text-blue-700'
                }`}>
                {resultType === 'success' ? 'Berhasil!' :
                  resultType === 'error' ? 'Gagal!' : 'Informasi'}
              </h3>
              <p className="text-gray-600 text-sm">
                {resultMessage}
              </p>
            </div>

            {/* Auto progress bar */}
            <div className="h-1 bg-gray-200">
              <div
                className={`h-full transition-all duration-3000 ease-linear progress-animation ${resultType === 'success' ? 'bg-green-500' :
                  resultType === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}