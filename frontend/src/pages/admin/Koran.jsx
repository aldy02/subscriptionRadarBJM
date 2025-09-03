import React, { useEffect, useState } from "react";
import { getPlans, createPlan, updatePlan, deletePlan } from "../../api/subscriptionPlanApi";
import { Plus, Edit2, Trash2, Search, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function Koran() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // State modal add/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
    description: "",
  });

  // State modal delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  // State modal success/error
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultType, setResultType] = useState('');
  const [resultMessage, setResultMessage] = useState('');

  // Ambil data subscription plans
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await getPlans(search);
      setPlans(response.data);
    } catch (error) {
      console.error("Gagal mengambil data paket:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [search]);

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

  // Submit form add/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await updatePlan(editingPlan.id, formData);
        showResult('success', 'Paket berhasil diperbarui');
      } else {
        await createPlan(formData);
        showResult('success', 'Paket berhasil ditambahkan');
      }
      setIsModalOpen(false);
      setFormData({ name: "", duration: "", price: "", description: "" });
      setEditingPlan(null);
      fetchPlans();
    } catch (error) {
      showResult('error', 'Gagal menyimpan paket');
      console.error("Gagal menyimpan paket:", error);
    }
  };

  // Hapus paket
  const handleDelete = (plan) => {
    setPlanToDelete(plan);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePlan(planToDelete.id);
      showResult('success', 'Paket berhasil dihapus');
      fetchPlans();
      setIsDeleteOpen(false);
      setPlanToDelete(null);
    } catch (error) {
      showResult('error', 'Gagal menghapus paket');
      setIsDeleteOpen(false);
    }
  };

  // Buka modal tambah/edit
  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData(plan);
    } else {
      setEditingPlan(null);
      setFormData({ name: "", duration: "", price: "", description: "" });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Manajemen Paket Langganan Koran</h1>
              <p className="text-gray-600 mt-1">
                Kelola paket langganan koran dan harga yang tersedia
              </p>
            </div>
          </div>

          {/* Search dan Add Plan sejajar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search */}
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari paket..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                           bg-white text-sm outline-none transition-all duration-200"
              />
            </div>

            {/* Button Add Plan */}
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm"
            >
              <Plus size={18} />
              Tambah Paket
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
                    #
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Paket
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durasi
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deskripsi
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
                        <span className="text-gray-500 text-sm">Loading plans...</span>
                      </div>
                    </td>
                  </tr>
                ) : plans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="text-gray-500">
                        <p className="text-lg font-medium">No plans found</p>
                        <p className="text-sm mt-1">Try adjusting your search terms</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  plans.map((plan, index) => (
                    <tr
                      key={plan.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600">{index + 1}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600">{plan.name}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600">{plan.duration} hari</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600">
                          Rp {plan.price?.toLocaleString('id-ID')}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {plan.description || <span className="text-gray-400">-</span>}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center items-center gap-1">
                          <button
                            onClick={() => openModal(plan)}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(plan)}
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
        </div>
      </div>

      {/* Modal Add/Edit Plan */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingPlan ? 'Edit Paket' : 'Tambah Paket'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {editingPlan ? 'Update informasi paket langganan' : 'Buat paket langganan baru'}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Paket
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    focus:outline-none bg-gray-50 focus:bg-white
                    text-sm transition-all duration-200"
                    placeholder="Masukkan nama paket"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durasi (hari)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    focus:outline-none bg-gray-50 focus:bg-white
                    text-sm transition-all duration-200"
                    placeholder="Masukkan durasi dalam hari"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    focus:outline-none bg-gray-50 focus:bg-white
                    text-sm transition-all duration-200"
                    placeholder="Masukkan harga"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    focus:outline-none bg-gray-50 focus:bg-white
                    text-sm transition-all duration-200"
                    placeholder="Masukkan deskripsi paket"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {editingPlan ? 'Update' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation */}
      {isDeleteOpen && planToDelete && (
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
                <p className="text-gray-700 mb-2">
                  Apakah Anda yakin ingin menghapus paket:
                </p>
                <p className="font-semibold text-gray-900 text-lg mb-1">
                  {planToDelete.name}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Durasi: {planToDelete.duration} hari - Rp {planToDelete.price?.toLocaleString('id-ID')}
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
                  setPlanToDelete(null);
                }}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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