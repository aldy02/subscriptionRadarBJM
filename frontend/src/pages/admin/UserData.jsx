import { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import { getUsers, updateUser, deleteUser } from "../../api/userApi";

export default function UserData() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // State modal
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Ambil data user
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers(page, limit, search);
      setUsers(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  // Hapus user
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      try {
        await deleteUser(id);
        alert("User berhasil dihapus");
        fetchUsers();
      } catch (error) {
        alert("Gagal menghapus user");
      }
    }
  };

  // Buka modal edit
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  // Simpan perubahan user
  const handleSave = async () => {
    try {
      await updateUser(selectedUser._id, selectedUser);
      alert("Data user berhasil diperbarui");
      fetchUsers();
      setIsOpen(false);
    } catch (error) {
      alert("Gagal memperbarui user");
    }
  };

  // Function untuk mendapatkan warna badge berdasarkan role
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "subscriber":
        return "bg-green-50 text-green-700 border border-green-200";
      case "non-subscriber":
        return "bg-gray-50 text-gray-600 border border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">List Data Pengguna</h1>
              <p className="text-gray-600 mt-1">
                Kelola data pengguna dan hak role mereka disini
              </p>
            </div>
          </div>

          {/* Search dan Add User sejajar */}
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
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                           bg-white text-sm outline-none transition-all duration-200"
              />
            </div>

            {/* Button Add User */}
            <button
              onClick={() => alert("Tambah user coming soon")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm"
            >
              <Plus size={18} />
              Tambah
            </button>
          </div>
        </div>
        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
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
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm mt-1">Try adjusting your search terms</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr
                      key={user._id}
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
                          {user.role === 'admin' ? 'Admin' :
                            user.role === 'subscriber' ? 'Subscriber' :
                              'Non-Subscriber'}
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
                            onClick={() => handleDelete(user._id)}
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

          {/* Pagination */}
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
      </div>

      {/* Modal Edit User */}
      {isOpen && (
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
                  onClick={() => setIsOpen(false)}
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
                    <select
                      value={selectedUser.role}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, role: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      focus:outline-none bg-gray-50 focus:bg-white
                      text-sm transition-all duration-200"
                    >
                      <option value="admin">Admin</option>
                      <option value="subscriber">Subscriber</option>
                      <option value="non-subscriber">Non-Subscriber</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}