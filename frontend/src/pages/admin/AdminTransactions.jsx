import { useEffect, useState } from "react";
import { 
  Check, 
  X, 
  Copy, 
  Upload, 
  AlertCircle,
  CreditCard,
  Calendar,
  FileText,
  Users,
  BarChart3,
  Settings,
  Headphones,
  Zap,
  Bell,
  Target,
  Shield,
  Smartphone
} from "lucide-react";
import { getPlans } from "../../api/subscriptionPlanApi";
import { createSubscriptionTransaction } from "../../api/transactionApi";
import ResultModal from "../../components/ResultModal";

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
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultModalType, setResultModalType] = useState("success");
  const [resultModalTitle, setResultModalTitle] = useState("");
  const [resultModalMessage, setResultModalMessage] = useState("");

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

  const copyAccount = (account) => {
    navigator.clipboard.writeText(account);
    setResultModalType("success");
    setResultModalTitle("Berhasil");
    setResultModalMessage("Nomor rekening berhasil disalin!");
    setShowResultModal(true);
  };

  const handleSubmitPayment = async () => {
    if (!paymentMethod) {
      setResultModalType("error");
      setResultModalTitle("Error");
      setResultModalMessage("Silakan pilih metode pembayaran!");
      setShowResultModal(true);
      return;
    }
    if (!proofFile) {
      setResultModalType("error");
      setResultModalTitle("Error");
      setResultModalMessage("Silakan upload bukti pembayaran!");
      setShowResultModal(true);
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("package_id", selectedPlan.id);
      formData.append("payment_method", paymentMethod);
      formData.append("proof_payment", proofFile);

      const result = await createSubscriptionTransaction(formData);

      setResultModalType("success");
      setResultModalTitle("Pembayaran Berhasil Dikirim!");
      setResultModalMessage(`Invoice: ${result.data.invoice_number}. Kami akan memverifikasi pembayaran Anda dalam 24 jam.`);
      setShowResultModal(true);
      closeModal();
    } catch (error) {
      console.error("Submit payment error:", error);
      setResultModalType("error");
      setResultModalTitle("Gagal Mengirim Pembayaran");
      setResultModalMessage(error.message || "Terjadi kesalahan saat mengirim pembayaran");
      setShowResultModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getPlanFeatures = (planName) => {
    const name = planName.toLowerCase();
    
    if (name.includes('basic')) {
      return [
        { icon: FileText, text: "Access to all news articles" },
        { icon: Bell, text: "Daily newsletter" },
        { icon: Smartphone, text: "Mobile app access" },
        { icon: Headphones, text: "Basic customer support" }
      ];
    }
    
    if (name.includes('premium')) {
      return [
        { icon: Check, text: "Everything in Basic" },
        { icon: Zap, text: "Exclusive premium content" },
        { icon: Bell, text: "Breaking news alerts" },
        { icon: Target, text: "Personalized recommendations" },
        { icon: Headphones, text: "Priority customer support" },
        { icon: Shield, text: "Ad-free experience" }
      ];
    }
    
    if (name.includes('enterprise')) {
      return [
        { icon: Check, text: "Everything in Premium" },
        { icon: Users, text: "Team collaboration tools" },
        { icon: BarChart3, text: "Analytics dashboard" },
        { icon: Settings, text: "Custom content curation" },
        { icon: Headphones, text: "Dedicated account manager" },
        { icon: Settings, text: "API access" }
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
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-center flex items-center justify-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const features = getPlanFeatures(plan.name);
            
            return (
              <div
                key={plan.id}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105"
              >
                <div className="p-8">
                  {/* Plan Name */}
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <span className="text-4xl font-bold text-blue-600">
                      Rp{plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600 block text-sm mt-1">
                      per month
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {/* Duration as Feature */}
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{plan.duration} days access</span>
                    </div>

                    {plan.description && (
                      <div className="flex items-start">
                        <FileText className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{plan.description}</span>
                      </div>
                    )}

                    {/* Plan-specific features */}
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <feature.icon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={() => handleBuy(plan)}
                    className="w-full py-3 px-6 rounded-xl font-semibold transition-colors bg-gray-900 text-white hover:bg-gray-800"
                  >
                    Beli Paket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Purchase {selectedPlan?.name}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Package Details */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border border-blue-100">
              <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                Package Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-semibold text-gray-900">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-1">
                    <Calendar size={16} />
                    {selectedPlan?.duration} days
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-blue-600">
                    Rp {selectedPlan?.price.toLocaleString()}
                  </span>
                </div>
                {selectedPlan?.description && (
                  <div className="pt-2 border-t border-blue-200">
                    <p className="text-sm text-gray-700">{selectedPlan.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                <CreditCard size={20} className="text-gray-700" />
                Pilih Metode Pembayaran
              </h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label 
                    key={method.id} 
                    className={`flex items-center justify-between p-4 border-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-all ${
                      paymentMethod === method.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{method.name} - {method.account}</p>
                        <p className="text-sm text-gray-600">a/n {method.owner}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyAccount(method.account)}
                      className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800 px-3 py-1 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Copy size={14} />
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
                  <AlertCircle size={18} />
                  Instruksi Pembayaran
                </h4>
                <div className="text-sm space-y-2 text-amber-700">
                  <p><strong>Transfer ke:</strong> {paymentMethods.find(m => m.id === paymentMethod)?.name} - {paymentMethods.find(m => m.id === paymentMethod)?.account}</p>
                  <p><strong>Nama Penerima:</strong> {paymentMethods.find(m => m.id === paymentMethod)?.owner}</p>
                  <p><strong>Jumlah Transfer:</strong> Rp {selectedPlan?.price.toLocaleString()}</p>
                  <div className="mt-3 p-3 bg-amber-100 rounded-lg">
                    <p className="font-medium text-amber-800">
                      📝 Pastikan jumlah transfer sesuai dengan harga paket dan upload bukti pembayaran di bawah ini.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Payment Proof */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                <Upload size={20} className="text-gray-700" />
                Upload Bukti Pembayaran
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProofFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Upload size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-blue-600 hover:text-blue-800 font-medium">
                        Click untuk upload bukti pembayaran
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Supported: JPG, PNG (Max: 5MB)
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {proofFile && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <Check size={16} />
                    File berhasil dipilih: <span className="font-medium">{proofFile.name}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                onClick={handleSubmitPayment}
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Kirim Pembayaran
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && (
        <ResultModal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          type={resultModalType}
          title={resultModalTitle}
          message={resultModalMessage}
        />
      )}
    </div>
  );
}