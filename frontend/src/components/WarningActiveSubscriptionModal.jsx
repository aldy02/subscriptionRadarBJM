import { AlertTriangle } from 'lucide-react';

const WarningActiveSubscriptionModal = ({
  isOpen,
  title,
  message,
  details,
  onConfirm,
  onCancel,
  confirmText = "Mengerti",
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
                {title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Perhatian diperlukan
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6">
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              {message}
            </p>

            {details && (
              <div className="bg-red-50 p-4 rounded-xl mb-4 border border-red-200">
                <div className="text-sm text-red-800 space-y-2">
                  {details.endDate && (
                    <p>
                      <strong>Berakhir:</strong> {new Date(details.endDate).toLocaleDateString('id-ID')}
                    </p>
                  )}
                  {details.daysRemaining && (
                    <p>
                      <strong>Sisa Hari:</strong> {details.daysRemaining} hari
                    </p>
                  )}
                  {details.planName && (
                    <p>
                      <strong>Paket Aktif:</strong> {details.planName}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              <strong>Info:</strong> Tunggu hingga subscription berakhir atau hubungi support untuk bantuan.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
          )}
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningActiveSubscriptionModal;