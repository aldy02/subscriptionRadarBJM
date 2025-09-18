import { useEffect, useState } from "react";
import { getPlans } from "../../api/subscriptionPlanApi";
import { createSubscriptionTransaction } from "../../api/transactionApi";

export default function Subscription() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const paymentMethods = [
    { id: "bca", name: "BCA - 098877887", account: "098877887", owner: "Aldy Rahman" },
    { id: "gopay", name: "GoPay - 081234567890", account: "081234567890", owner: "Aldy Rahman" },
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
    alert("Account number copied!");
  };

  const handleSubmitPayment = async () => {
  if (!paymentMethod) {
    alert("Please select a payment method!");
    return;
  }
  if (!proofFile) {
    alert("Please upload payment proof!");
    return;
  }

  try {
    setSubmitting(true);

    const formData = new FormData();
    formData.append("package_id", selectedPlan.id);
    formData.append("payment_method", paymentMethod);
    formData.append("proof_payment", proofFile);

    const result = await createSubscriptionTransaction(formData);

    alert(
      `Payment submitted successfully! Invoice: ${result.data.invoice_number}. We will verify your payment within 24 hours.`
    );
    closeModal();
  } catch (error) {
    console.error("Submit payment error:", error);
    alert(error.message || "An error occurred while submitting payment");
  } finally {
    setSubmitting(false);
  }
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
          {plans.map((plan, index) => {
            return (
              <div
                key={plan.id}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105"
              >
                <div className="p-8">
                  {/* Plan Name */}
                  <h3 className="text-xl font text-gray-900 text-center mb-4">
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

                  {/* Description as Features */}
                  <div className="space-y-4 mb-8">
                    {/* Duration as Feature */}
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{plan.duration} days access</span>
                    </div>

                    {plan.description && (
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{plan.description}</span>
                      </div>
                    )}

                    {/* You can add more static features based on plan type */}
                    {plan.name.toLowerCase().includes('basic') && (
                      <>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Access to all news articles</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Daily newsletter</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Mobile app access</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Basic customer support</span>
                        </div>
                      </>
                    )}

                    {plan.name.toLowerCase().includes('premium') && (
                      <>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Everything in Basic</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Exclusive premium content</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Breaking news alerts</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Personalized recommendations</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Priority customer support</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Ad-free experience</span>
                        </div>
                      </>
                    )}

                    {plan.name.toLowerCase().includes('enterprise') && (
                      <>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Everything in Premium</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Team collaboration tools</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Analytics dashboard</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Custom content curation</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">Dedicated account manager</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">API access</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={() => handleBuy(plan)}
                    className="w-full py-2 px-6 rounded-xl font-semibold transition-colors bg-gray-900 text-white hover:bg-gray-800"
                  >
                    Beli Paket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Purchase {selectedPlan?.name}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Package Details */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-2">Package Details</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Package:</strong> {selectedPlan?.name}</p>
                <p><strong>Description:</strong> {selectedPlan?.description}</p>
                <p><strong>Duration:</strong> {selectedPlan?.duration} days</p>
                <p className="text-lg font-bold text-blue-600">
                  <strong>Price:</strong> Rp {selectedPlan?.price.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Pilih Metode Pembayaran</h3>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label key={method.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-600">a/n {method.owner}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyAccount(method.account)}
                      className="text-blue-600 text-sm hover:text-blue-800 px-2 py-1 border border-blue-600 rounded"
                    >
                      Copy
                    </button>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Instructions */}
            {paymentMethod && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold mb-2">Instuksi Pembayaran</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Transfer:</strong> {paymentMethods.find(m => m.id === paymentMethod)?.name}</p>
                  <p><strong>Nama Akun:</strong> {paymentMethods.find(m => m.id === paymentMethod)?.owner}</p>
                  <p><strong>Total:</strong> Rp {selectedPlan?.price.toLocaleString()}</p>
                  <p className="text-orange-600 mt-2">
                    <strong>Note:</strong> Silakan transfer jumlah yang sesuai dan upload bukti pembayaran di bawah ini
                  </p>
                </div>
              </div>
            )}

            {/* Upload Payment Proof */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Upload Bukti Pembayaran</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-blue-600 hover:text-blue-800">
                      Click untuk upload bukti pembayaran
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported: JPG, PNG (Max: 5MB)
                    </p>
                  </div>
                </label>
              </div>

              {proofFile && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    File selected: {proofFile.name}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                onClick={handleSubmitPayment}
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Kirim'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}