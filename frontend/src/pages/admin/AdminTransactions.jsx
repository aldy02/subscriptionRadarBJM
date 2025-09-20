import { useEffect, useState } from "react";
import { BarChart3, CheckCircle, Clock, XCircle, Eye, Check, X, Filter } from "lucide-react";
import { getAllTransactions, updateTransactionStatus } from "../../api/transactionApi";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getAllTransactions(filters);
      setTransactions(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Fetch transactions error:", err);
      setError(err.message || "Failed to load transaction data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (transactionId, status, adminNotes = '') => {
    try {
      setActionLoading(true);
      await updateTransactionStatus(transactionId, {
        status,
        admin_notes: adminNotes
      });

      await fetchTransactions();
      setShowModal(false);
      setSelectedTransaction(null);

    } catch (error) {
      console.error('Update status error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { bg: "bg-yellow-50", text: "text-yellow-700", icon: Clock, border: "border-yellow-200" },
      accepted: { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle, border: "border-green-200" },
      rejected: { bg: "bg-red-50", text: "text-red-700", icon: XCircle, border: "border-red-200" }
    };

    const style = statusStyles[status];
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const openTransactionModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  const stats = {
    total: transactions.length,
    accepted: transactions.filter(t => t.status === 'accepted').length,
    pending: transactions.filter(t => t.status === 'pending').length,
    rejected: transactions.filter(t => t.status === 'rejected').length
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading transaksi...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Manajemen Transaksi</h1>
          <p className="text-gray-600">Kelola dan review semua transaksi</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua</option>
                <option value="subscription">Subscription</option>
                <option value="advertisement">Advertisement</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transaction Details Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Detail Transaksi</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="text-sm text-gray-900">
                        {transaction.user?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.payment_method?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${transaction.type === 'subscription'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                        }`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openTransactionModal(transaction)}
                          className="inline-flex border border-gray-300 items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        {transaction.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(transaction.id, 'accepted')}
                              disabled={actionLoading}
                              className="inline-flex border border-gray-300 items-center gap-1 px-2 py-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                            >
                              <Check size={14} />
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(transaction.id, 'rejected')}
                              disabled={actionLoading}
                              className="inline-flex border border-gray-300 items-center gap-1 px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                            >
                              <X size={14} />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Detail Modal */}
        {showModal && selectedTransaction && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop with blur */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300"></div>
            {/* Modal Content */}
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 scale-100">
                {/* Modal Header */}
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Detail Transalsi</h2>
                      <p className="text-sm text-gray-500 mt-1">Invoice #{selectedTransaction.invoice_number}</p>
                    </div>
                    <button
                      onClick={closeModal}
                      className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="max-h-[70vh] overflow-y-auto p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Transaction Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Transaksi</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                            {getStatusBadge(selectedTransaction.status)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Type</p>
                            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${selectedTransaction.type === 'subscription'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                              }`}>
                              {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Customer</p>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="font-medium text-gray-900">{selectedTransaction.user?.name}</p>
                              <p className="text-sm text-gray-600">{selectedTransaction.user?.email}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Metode</p>
                              <p className="text-gray-900 font-medium">
                                {selectedTransaction.payment_method?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Tanggal</p>
                              <p className="text-gray-900 font-medium">{formatDate(selectedTransaction.created_at)}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {formatCurrency(selectedTransaction.total_price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Proof */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Bukti Pembayaran</h3>
                      <div className="bg-gray-50 rounded-xl overflow-hidden">
                        {selectedTransaction.proof_payment ? (
                          <div className="aspect-square w-full">
                            <img
                              src={`http://localhost:5000/uploads/payments/${selectedTransaction.proof_payment}`}
                              alt="Payment Proof"
                              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                              onClick={() => {
                                // Open image in new tab for full view
                                window.open(`http://localhost:5000/uploads/payments/${selectedTransaction.proof_payment}`, '_blank');
                              }}
                            />
                          </div>
                        ) : (
                          <div className="aspect-square w-full flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                <XCircle className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-gray-500 font-medium">No payment proof uploaded</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {selectedTransaction.proof_payment && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Klik gambar untuk melihat ukuran penuh
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer - Admin Actions */}
                {selectedTransaction.status === 'pending' && (
                  <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">Admin Actions</h4>
                        <p className="text-xs text-gray-600">Periksa bukti pembayaran dan setujui atau tolak transaksi ini</p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleStatusUpdate(selectedTransaction.id, 'rejected')}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-200 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <X size={16} />
                          {actionLoading ? 'Processing...' : 'Reject'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedTransaction.id, 'accepted')}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Check size={16} />
                          {actionLoading ? 'Processing...' : 'Accept'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}