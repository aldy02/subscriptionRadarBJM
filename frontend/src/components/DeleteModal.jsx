import { AlertTriangle } from 'lucide-react';

const DeleteModal = ({ 
  isOpen, 
  title, 
  itemName, 
  itemDetails, 
  onConfirm, 
  onCancel,
  loading = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {title || 'Konfirmasi Hapus'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Tindakan ini tidak dapat dibatalkan
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6">
          <div className="text-center">
            <p className="text-gray-700 mb-2">
              Apakah Anda yakin ingin menghapus:
            </p>
            <p className="font-semibold text-gray-900 text-lg mb-1">
              {itemName}
            </p>
            {itemDetails && (
              <p className="text-gray-500 text-sm mb-4">
                {itemDetails}
              </p>
            )}
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              Data yang sudah dihapus tidak dapat dikembalikan!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menghapus...
              </div>
            ) : (
              'Ya, Hapus'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;