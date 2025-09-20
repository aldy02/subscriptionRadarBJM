import { useEffect, useState } from "react";
import { Check, X, Copy, Upload, CheckCircle, Clock, CreditCard, Smartphone, Bell, Star, Users, BarChart3, Settings, Headphones, Zap } from "lucide-react";
import { getPlans } from "../../api/subscriptionPlanApi";
import { createSubscriptionTransaction } from "../../api/transactionApi";
import ResultModal from "../../components//ResultModal";

export default function Subscription() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Result Modal states
  const [resultModal, setResultModal] = useState({
    isOpen: false,
    type: '',
    message: ''
  });

  const paymentMethods = [
    { id: "bca", name: "BCA", account: "098877887", owner: "Aldy Rahman" },
    { id: "gopay", name: "GoPay", account: "081234567890", owner: "Aldy Rahman" },
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await getPlans();
        setPlans(res.data);
      } catch (err) {
        console.error("Fetch plans error:", err);
        setError("Gagal memuat subscription plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleBuy = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setPaymentMethod("");
    setProofFile(null);
  };

  const showResultModal = (type, message) => {
    setResultModal({
      isOpen: true,
      type,
      message
    });
    
    // Auto close after 3 seconds
    setTimeout(() => {
      setResultModal({
        isOpen: false,
        type: '',
        message: ''
      });
    }, 3000);
  };

  const copyAccount = (account) => {
    navigator.clipboard.writeText(account);
    showResultModal('success', 'Nomor rekening berhasil disalin!');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setProofFile(null);
      return;
    }

    // Check file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      showResultModal('error', 'Ukuran file terlalu besar! Maksimal 2MB');
      e.target.value = ''; // Reset input
      setProofFile(null);
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showResultModal('error', 'Format file tidak didukung! Hanya JPG dan PNG yang diizinkan');
      e.target.value = ''; // Reset input
      setProofFile(null);
      return;
    }

    setProofFile(file);
  };

  const handleSubmitPayment = async () => {
    if (!paymentMethod) {
      showResultModal('error', 'Silakan pilih metode pembayaran!');
      return;
    }
    if (!proofFile) {
      showResultModal('error', 'Silakan upload bukti pembayaran!');
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("package_id", selectedPlan.id);
      formData.append("payment_method", paymentMethod);
      formData.append("proof_payment", proofFile);

      const result = await createSubscriptionTransaction(formData);

      showResultModal(
        'success',
        `Pembayaran berhasil dikirim! Invoice: ${result.data.invoice_number}. Kami akan verifikasi dalam 24 jam.`
      );
      closeModal();
    } catch (error) {
      console.error("Submit payment error:", error);
      showResultModal('error', error.message || 'Terjadi kesalahan saat mengirim pembayaran');
    } finally {
      setSubmitting(false);
    }
  };

  const getPlanFeatures = (planName) => {
    const name = planName.toLowerCase();
    
    if (name.includes('basic')) {
      return [
        { icon: <Check className="w-4 h-4" />, text: "Access to all news articles" },
        { icon: <Bell className="w-4 h-4" />, text: "Daily newsletter" },
        { icon: <Smartphone className="w-4 h-4" />, text: "Mobile app access" },
        { icon: <Headphones className="w-4 h-4" />, text: "Basic customer support" }
      ];
    }
    
    if (name.includes('premium')) {
      return [
        { icon: <Check className="w-4 h-4" />, text: "Everything in Basic" },
        { icon: <Star className="w-4 h-4" />, text: "Exclusive premium content" },
        { icon: <Bell className="w-4 h-4" />, text: "Breaking news alerts" },
        { icon: <Settings className="w-4 h-4" />, text: "Personalized recommendations" },
        { icon: <Headphones className="w-4 h-4" />, text: "Priority customer support" },
        { icon: <Zap className="w-4 h-4" />, text: "Ad-free experience" }
      ];
    }
    
    if (name.includes('enterprise')) {
      return [
        { icon: <Check className="w-4 h-4" />, text: "Everything in Premium" },
        { icon: <Users className="w-4 h-4" />, text: "Team collaboration tools" },
        { icon: <BarChart3 className="w-4 h-4" />, text: "Analytics dashboard" },
        { icon: <Settings className="w-4 h-4" />, text: "Custom content curation" },
        { icon: <Headphones className="w-4 h-4" />, text: "Dedicated account manager" },
        { icon: <CreditCard className="w-4 h-4" />, text: "API access" }
      ];
    }
    
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pilih Paket Berlangganan
          </h1>
          <p className="text-xl text-gray-600">
            Dapatkan akses tak terbatas ke konten berita premium.
          </p>
        </div>

        {loading && (
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading plans...</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const features = getPlanFeatures(plan.name);
            
            return (
              <div
                key={plan.id}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105"
              >
                <div className="p-8">
                  {/* Plan Name */}
                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <span className="text-4xl font-bold text-blue-600">
                      Rp{plan.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {/* Duration Feature */}
                    <div className="flex items-center gap-3">
                      <div className="text-green-500 flex-shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-gray-700 text-sm">{plan.duration} hari akses</span>
                    </div>

                    {/* Description Feature */}
                    {plan.description && (
                      <div className="flex items-center gap-3">
                        <div className="text-green-500 flex-shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <span className="text-gray-700 text-sm">{plan.description}</span>
                      </div>
                    )}

                    {/* Plan-specific Features */}
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="text-green-500 flex-shrink-0">
                          {feature.icon}
                        </div>
                        <span className="text-gray-700 text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={() => handleBuy(plan)}
                    className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg"
                  >
                    Beli Paket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900">
                Purchase {selectedPlan?.name}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Package Details */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6">
                  <h3 className="font-bold text-lg mb-4 text-gray-900">Package Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nama Paket:</span>
                      <span className="font-semibold text-gray-900">{selectedPlan?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durasi:</span>
                      <span className="font-semibold text-gray-900">{selectedPlan?.duration} hari</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                      <span className="text-gray-600">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        Rp {selectedPlan?.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4 text-gray-900">Pilih Metode Pembayaran</h3>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label key={method.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer transition-colors">
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <CreditCard className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{method.name}</p>
                              <p className="text-sm text-gray-600">{method.account} • {method.owner}</p>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyAccount(method.account)}
                          className="flex items-center gap-2 text-blue-600 text-sm hover:text-blue-800 px-3 py-1.5 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </button>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Payment Instructions */}
                {paymentMethod && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <h4 className="font-bold mb-3 text-amber-800 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Instruksi Pembayaran
                    </h4>
                    <div className="text-sm space-y-2 text-amber-700">
                      <p><strong>Transfer ke:</strong> {paymentMethods.find(m => m.id === paymentMethod)?.name}</p>
                      <p><strong>Nomor:</strong> {paymentMethods.find(m => m.id === paymentMethod)?.account}</p>
                      <p><strong>Nama:</strong> {paymentMethods.find(m => m.id === paymentMethod)?.owner}</p>
                      <p><strong>Jumlah:</strong> Rp {selectedPlan?.price.toLocaleString()}</p>
                      <p className="text-amber-600 mt-3 p-2 bg-amber-100 rounded-lg">
                        <strong>Catatan:</strong> Transfer sesuai nominal dan upload bukti pembayaran
                      </p>
                    </div>
                  </div>
                )}

                {/* Upload Payment Proof */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4 text-gray-900">Upload Bukti Pembayaran</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="space-y-3">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-blue-600 hover:text-blue-800 font-semibold">
                            Klik untuk upload bukti pembayaran
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Format: JPG, PNG • Maksimal: 2MB
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {proofFile && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-sm text-green-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <strong>File terpilih:</strong> {proofFile.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
              <button
                onClick={closeModal}
                className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors font-semibold"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                onClick={handleSubmitPayment}
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Kirim
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      <ResultModal
        isOpen={resultModal.isOpen}
        type={resultModal.type}
        message={resultModal.message}
        onClose={() => setResultModal({ isOpen: false, type: '', message: '' })}
      />
    </div>
  );
}