import { useEffect, useState } from "react";
import { getUserTransactions } from "../../api/transactionApi";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await getUserTransactions();
        setTransactions(response.data);
      } catch (err) {
        console.error("Fetch transactions error:", err);
        setError(err.message || "Gagal memuat riwayat transaksi");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      accepted: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200"
    };

    const statusText = {
      pending: "Pending",
      accepted: "Accepted",
      rejected: "Rejected"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const printInvoice = (transaction) => {
  const printWindow = window.open("", "_blank");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${transaction.invoice_number}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .invoice-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .detail-section {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 5px;
        }
        .detail-section h3 {
          margin-top: 0;
          color: #2563eb;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-pending { background-color: #fef3cd; color: #8a6d3b; }
        .status-accepted { background-color: #d4edda; color: #155724; }
        .status-rejected { background-color: #f8d7da; color: #721c24; }
        .payment-info {
          margin-top: 20px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 5px;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>INVOICE</h1>
        <h2>${transaction.invoice_number}</h2>
        <p>Tanggal: ${new Date(transaction.created_at).toLocaleString("id-ID")}</p>
      </div>

      <div class="invoice-details">
        <div class="detail-section">
          <h3>Informasi Transaksi</h3>
          <p><strong>Paket:</strong> ${transaction.SubscriptionPlan?.name || "N/A"}</p>
          <p><strong>Type:</strong> ${transaction.type}</p>
          <p><strong>Status:</strong> 
            <span class="status-badge status-${transaction.status}">${transaction.status}</span>
          </p>
          <p><strong>Metode Pembayaran:</strong> ${transaction.payment_method.toUpperCase()}</p>
        </div>

        <div class="detail-section">
          <h3>Detail Pembayaran</h3>
          <p><strong>Total Harga:</strong></p>
          <h2 style="color: #2563eb; margin: 10px 0;">Rp${transaction.total_price.toLocaleString("id-ID")}</h2>
          ${transaction.admin_notes ? `<p><strong>Catatan Admin:</strong> ${transaction.admin_notes}</p>` : ""}
        </div>
      </div>

      ${transaction.proof_payment ? `
        <div class="payment-info">
          <h3>Bukti Pembayaran</h3>
          <p><strong>File:</strong> ${transaction.proof_payment}</p>
        </div>
      ` : ""}

      <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
        <p>Terima kasih atas kepercayaan Anda</p>
        <p>Dicetak pada: ${new Date().toLocaleString("id-ID")}</p>
      </div>
    </body>
    </html>
  `;

  // langsung isi body window baru
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // tunggu selesai render, baru print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading riwayat transaksi...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Transaksi</h1>
          <p className="text-gray-600">Lihat semua transaksi langganan pembelian anda</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Transactions Found</h3>
            <p className="text-gray-500 mb-6">You haven't made any subscription purchases yet.</p>
            <a
              href="/subscription"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Subscription Plans
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Invoice #{transaction.invoice_number}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nama Paket</p>
                      <p className="text-gray-900 capitalize font-semibold">
                        {transaction.SubscriptionPlan?.name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Type</p>
                      <p className="text-gray-900 capitalize">{transaction.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Metode Pembayaran</p>
                      <p className="text-gray-900 uppercase">{transaction.payment_method}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Total</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {formatCurrency(transaction.total_price)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Proof */}
                  {transaction.proof_payment && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Payment Proof</p>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <img
                            src={`http://localhost:5000/uploads/payments/${transaction.proof_payment}`}
                            alt="Payment Proof"
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">{transaction.proof_payment}</p>
                          <a
                            href={`http://localhost:5000/uploads/payments/${transaction.proof_payment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            View image
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Message */}
                  <div className="mt-4 p-3 rounded-lg bg-gray-50">
                    {transaction.status === 'pending' && (
                      <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Pembayaran Dalam Proses Peninjauan</p>
                          <p className="text-sm text-yellow-700">Pembayaran Anda sedang diverifikasi oleh tim admin kami. Proses ini biasanya memakan waktu hingga 24 jam</p>
                        </div>
                      </div>
                    )}

                    {transaction.status === 'accepted' && (
                      <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-green-800">Pembayaran Diterima</p>
                          <p className="text-sm text-green-700">Paket berlangganan anda telah sukses diaktifkan. Nikmati akses premium anda!</p>
                        </div>
                      </div>
                    )}

                    {transaction.status === 'rejected' && (
                      <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-red-800">Pembayaran Ditolak</p>
                          <p className="text-sm text-red-700">Pembayaran Anda ditolak. Silakan hubungi dukungan pelanggan atau coba lagi dengan detail pembayaran yang benar</p>
                          {transaction.admin_notes && (
                            <p className="text-sm text-red-600 mt-1">
                              <strong>Admin Notes:</strong> {transaction.admin_notes}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => printInvoice(transaction)}
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a1 1 0 001-1v-4a1 1 0 00-1-1H9a1 1 0 00-1 1v4a1 1 0 001 1zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      <span>Print Invoice</span>
                    </button>

                    {transaction.status === 'rejected' && (
                      <a
                        href="/subscription"
                        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Try Again
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (if needed for pagination) */}
        {transactions.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}