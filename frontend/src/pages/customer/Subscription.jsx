import { useEffect, useState } from "react";

export default function Subscription() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Payment methods
  const paymentMethods = [
    { id: 'bca', name: 'BCA - 098877887', account: '098877887' },
    { id: 'gopay', name: 'GoPay - 081234567890', account: '081234567890' }
  ];

  // Debug: Fetch plans dengan error handling yang lebih baik
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        console.log('Fetching from:', "/api/subscription-plans");
        
        const response = await fetch("/api/subscription-plans");
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Response is not JSON:', text);
          throw new Error('Server returned HTML instead of JSON');
        }
        
        const data = await response.json();
        console.log('Plans data:', data);
        setPlans(data);
        
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        
        // Fallback: Use dummy data untuk testing
        setPlans([
          { id: 1, name: 'Basic Plan', description: 'Basic subscription', price: 50000, duration: 30 },
          { id: 2, name: 'Premium Plan', description: 'Premium subscription', price: 100000, duration: 60 }
        ]);
      }
    };

    fetchPlans();
  }, []);

  const handleBuy = (plan) => {
    setSelectedPlan(plan);
    setStep(1);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!proofFile || !paymentMethod) {
      alert("Please select payment method and upload proof!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("proof", proofFile);
    formData.append("plan_id", selectedPlan.id);
    formData.append("payment_method", paymentMethod);

    try {
      console.log('Submitting to:', "/api/transactions");
      
      const response = await fetch("/api/transactions", {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Submit response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Submit result:', result);
        alert("Transaction submitted successfully!");
        closeModal();
      } else {
        const errorData = await response.text();
        console.error('Submit error:', errorData);
        alert(`Failed to submit transaction: ${response.status}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert("Error submitting transaction: " + error.message);
    }
    setLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setSelectedPlan(null);
    setPaymentMethod('');
    setProofFile(null);
  };

  const copyAccount = (account) => {
    navigator.clipboard.writeText(account);
    alert("Account number copied!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Subscription Plans</h1>
      
      {/* Debug Info */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
          <p className="text-sm mt-1">Check console for details. Using dummy data for now.</p>
        </div>
      )}
      
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="border p-4 rounded bg-white shadow">
            <h3 className="text-xl font-semibold text-blue-600">{plan.name}</h3>
            <p className="text-gray-600 mt-2">{plan.description}</p>
            <p className="text-2xl font-bold mt-2">Rp {plan.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{plan.duration} days</p>
            <button 
              onClick={() => handleBuy(plan)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Buy Package
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Purchase {selectedPlan?.name}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>

            {/* Step 1: Review */}
            {step === 1 && (
              <div>
                <div className="bg-gray-50 p-4 rounded mb-4">
                  <p><strong>Package:</strong> {selectedPlan?.name}</p>
                  <p><strong>Description:</strong> {selectedPlan?.description}</p>
                  <p><strong>Price:</strong> Rp {selectedPlan?.price.toLocaleString()}</p>
                  <p><strong>Duration:</strong> {selectedPlan?.duration} days</p>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div>
                <h3 className="font-bold mb-3">Select Payment Method:</h3>
                {paymentMethods.map(method => (
                  <div key={method.id} className="mb-2">
                    <label className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span>{method.name}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => copyAccount(method.account)}
                        className="text-blue-600 text-sm hover:text-blue-800"
                      >
                        Copy
                      </button>
                    </label>
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    disabled={!paymentMethod}
                    className="flex-1 bg-blue-600 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Upload Proof */}
            {step === 3 && (
              <div>
                <h3 className="font-bold mb-3">Upload Payment Proof:</h3>
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p><strong>Transfer to:</strong></p>
                  <p className="text-lg">{paymentMethods.find(m => m.id === paymentMethod)?.name}</p>
                  <p><strong>Amount:</strong> Rp {selectedPlan?.price.toLocaleString()}</p>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofFile(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-800">
                    Click to upload payment proof
                  </label>
                  <p className="text-sm text-gray-500 mt-1">Max 5MB, JPG/PNG only</p>
                </div>
                
                {proofFile && (
                  <p className="text-sm text-green-600 mb-4">
                    ✓ File selected: {proofFile.name}
                  </p>
                )}
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={loading || !proofFile}
                    className="flex-1 bg-green-600 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
                  >
                    {loading ? "Submitting..." : "Submit Transaction"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}