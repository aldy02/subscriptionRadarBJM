import { useEffect, useState } from "react";
import { getAdvertisements, createAdvertisement, updateAdvertisement, deleteAdvertisement } from "../../api/advertisementApi";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import ResultModal from "../../components/ResultModal";
import DeleteModal from "../../components/DeleteModal";

export default function Iklan() {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // State modal add/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdvertisement, setEditingAdvertisement] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    price: "",
  });

  // State modal delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [advertisementToDelete, setAdvertisementToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // State modal success/error
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultType, setResultType] = useState('');
  const [resultMessage, setResultMessage] = useState('');

  // Ambil data advertisements
  const fetchAdvertisements = async () => {
    setLoading(true);
    try {
      const response = await getAdvertisements(search ? { search } : {});
      setAdvertisements(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data iklan:", error);
      showResult('error', 'Gagal mengambil data iklan');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAdvertisements();
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
      if (editingAdvertisement) {
        await updateAdvertisement(editingAdvertisement.id, formData);
        showResult('success', 'Paket iklan berhasil diperbarui');
      } else {
        await createAdvertisement(formData);
        showResult('success', 'Paket iklan berhasil ditambahkan');
      }
      setIsModalOpen(false);
      setFormData({ name: "", size: "", price: "" });
      setEditingAdvertisement(null);
      fetchAdvertisements();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan iklan';
      showResult('error', errorMsg);
    }
  };


  // Hapus iklan
  const handleDelete = (advertisement) => {
    setAdvertisementToDelete(advertisement);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteAdvertisement(advertisementToDelete.id);
      showResult('success', 'Paket iklan berhasil dihapus');
      fetchAdvertisements();
      setIsDeleteOpen(false);
      setAdvertisementToDelete(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Gagal menghapus iklan';
      showResult('error', errorMsg);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Buka modal tambah/edit
  const openModal = (advertisement = null) => {
    if (advertisement) {
      setEditingAdvertisement(advertisement);
      setFormData(advertisement);
    } else {
      setEditingAdvertisement(null);
      setFormData({ name: "", size: "", price: "" });
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
              <h1 className="text-2xl font-semibold text-gray-900">Manajemen Iklan</h1>
              <p className="text-gray-600 mt-1">
                Kelola paket iklan dan harga yang tersedia
              </p>
            </div>
          </div>

          {/* Search dan Add Advertisement sejajar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search */}
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari iklan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                           bg-white text-sm outline-none transition-all duration-200"
              />
            </div>

            {/* Button Add Advertisement */}
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm"
            >
              <Plus size={18} />
              Tambah Iklan
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
                    Nama Iklan
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ukuran
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
                        <span className="text-gray-500 text-sm">Loading advertisements...</span>
                      </div>
                    </td>
                  </tr>
                ) : advertisements.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="text-gray-500">
                        <p className="text-lg font-medium">No advertisements found</p>
                        <p className="text-sm mt-1">Try adjusting your search terms</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  advertisements.map((advertisement, index) => (
                    <tr
                      key={advertisement.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600">{index + 1}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600">{advertisement.name}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600">{advertisement.size}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600">
                          Rp {advertisement.price?.toLocaleString('id-ID')}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center items-center gap-1">
                          <button
                            onClick={() => openModal(advertisement)}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(advertisement)}
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

      {/* Modal Add/Edit Advertisement */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingAdvertisement ? 'Edit Iklan' : 'Tambah Iklan'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {editingAdvertisement ? 'Update informasi iklan' : 'Buat iklan baru'}
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
                    Nama Iklan
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    focus:outline-none bg-gray-50 focus:bg-white
                    text-sm transition-all duration-200"
                    placeholder="Masukkan nama iklan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ukuran
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    focus:outline-none bg-gray-50 focus:bg-white
                    text-sm transition-all duration-200"
                    placeholder="Masukkan ukuran"
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
                {editingAdvertisement ? 'Update' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation */}
      <DeleteModal
        isOpen={isDeleteOpen}
        title="Konfirmasi Hapus Iklan"
        itemName={advertisementToDelete?.name}
        itemDetails={advertisementToDelete ? `Ukuran: ${advertisementToDelete.size} - Rp ${advertisementToDelete.price?.toLocaleString('id-ID')}` : ''}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setAdvertisementToDelete(null);
        }}
        loading={deleteLoading}
      />

      {/* Modal Result (Success/Error) */}
      <ResultModal
        isOpen={isResultOpen}
        type={resultType}
        message={resultMessage}
        onClose={() => setIsResultOpen(false)}
      />
    </div>
  );
}