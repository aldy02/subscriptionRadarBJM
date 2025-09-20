import { useEffect, useState } from "react";
import {
  X,
  Copy,
  Upload,
  CheckCircle,
  CreditCard,
  Bell,
  Calendar,
  Clock,
  FileText,
  Image as ImageIcon,
  Megaphone,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";
import {
  getAdvertisements,
  createAdvertisement,
} from "../../api/advertisementApi";
import ResultModal from "../../components/ResultModal";

export default function Advertisement() {
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [proofFile, setProofFile] = useState(null);

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
    const fetchAds = async () => {
      try {
        setLoading(true);
        const res = await getAdvertisements();
        console.log("API response:", res.data);
        setAds(res.data.data || []);
      } catch (err) {
        console.error("Fetch ads error:", err);
        showResultModal('error', 'Gagal memuat paket iklan');
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  const handleBuy = (ad) => {
    setSelectedAd(ad);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAd(null);
    setContent("");
    setPhoto(null);
    setStartDate("");
    setDuration("");
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setPhoto(null);
      return;
    }

    // Check file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      showResultModal('error', 'Ukuran gambar iklan terlalu besar! Maksimal 2MB');
      e.target.value = '';
      setPhoto(null);
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showResultModal('error', 'Format gambar tidak didukung! Hanya JPG dan PNG yang diizinkan');
      e.target.value = '';
      setPhoto(null);
      return;
    }

    setPhoto(file);
  };

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setProofFile(null);
      return;
    }

    // Check file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      showResultModal('error', 'Ukuran bukti pembayaran terlalu besar! Maksimal 2MB');
      e.target.value = '';
      setProofFile(null);
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showResultModal('error', 'Format file tidak didukung! Hanya JPG dan PNG yang diizinkan');
      e.target.value = '';
      setProofFile(null);
      return;
    }

    setProofFile(file);
  };

  const handleSubmit = async () => {
    // Validation
    if (!content.trim()) {
      showResultModal('error', 'Isi konten iklan tidak boleh kosong!');
      return;
    }
    if (!photo) {
      showResultModal('error', 'Silakan upload gambar iklan!');
      return;
    }
    if (!startDate) {
      showResultModal('error', 'Silakan pilih tanggal mulai!');
      return;
    }
    if (!duration || duration < 1) {
      showResultModal('error', 'Silakan isi durasi iklan (minimal 1 hari)!');
      return;
    }
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

      // Calculate total price
      const totalPrice = selectedAd.price * parseInt(duration);

      const formData = new FormData();
      formData.append("package_id", selectedAd.id);
      formData.append("content", content);
      formData.append("photo", photo);
      formData.append("start_date", startDate);
      formData.append("duration", duration);
      formData.append("total_price", totalPrice.toString()); // Send calculated total price
      formData.append("payment_method", paymentMethod);
      formData.append("proof_payment", proofFile);

      const result = await createAdvertisement(formData);

      showResultModal('success', 'Iklan berhasil dibuat! Menunggu verifikasi admin dalam 24 jam.');
      closeModal();
    } catch (error) {
      console.error("Submit ad error:", error);
      showResultModal('error', error.message || 'Terjadi kesalahan saat membuat iklan');
    } finally {
      setSubmitting(false);
    }
  };

  const getAdFeatures = (adName, adSize) => {
    const name = adName.toLowerCase();
    const features = [
      { icon: <Target className="w-4 h-4" />, text: `Ukuran ${adSize}` },
      { icon: <TrendingUp className="w-4 h-4" />, text: "Peningkatan trafik penjualan/produk" },
    ];

    if (name.includes('banner')) {
      features.push(
        { icon: <Megaphone className="w-4 h-4" />, text: "Tampil di header" },
        { icon: <Zap className="w-4 h-4" />, text: "Engagement maksimal" }
      );
    } else if (name.includes('sidebar')) {
      features.push(
        { icon: <Megaphone className="w-4 h-4" />, text: "Posisi samping artikel" },
        { icon: <Target className="w-4 h-4" />, text: "Target pembaca aktif" }
      );
    }

    return features;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pilih Paket Iklan
          </h1>
          <p className="text-xl text-gray-600">
            Pasang iklan Anda dan jangkau lebih banyak pelanggan
          </p>
        </div>

        {loading && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg text-gray-600">Loading paket iklan...</p>
            </div>
          </div>
        )}

        {/* Advertisement Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ads.map((ad) => {
            const features = getAdFeatures(ad.name, ad.size);
            
            return (
              <div
                key={ad.id}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105"
              >
                <div className="p-8">
                  {/* Ad Name */}
                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                    {ad.name}
                  </h3>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <span className="text-4xl font-bold text-blue-600">
                      Rp{ad.price?.toLocaleString()}
                    </span>
                    <span className="text-gray-600 block text-sm mt-3">
                      per hari
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
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
                    onClick={() => handleBuy(ad)}
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
                Beli {selectedAd?.name}
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
                  <h3 className="font-bold text-lg mb-4 text-gray-900">Detail Paket</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nama Paket:</span>
                      <span className="font-semibold text-gray-900">{selectedAd?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ukuran:</span>
                      <span className="font-semibold text-gray-900">{selectedAd?.size}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                      <span className="text-gray-600">Harga per hari:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        Rp {selectedAd?.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ad Content Input */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Isi Konten Iklan
                  </h3>
                  <textarea
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-blue-300 focus:outline-none transition-colors"
                    rows="4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tulis isi konten iklan Anda..."
                  />
                </div>

                {/* Photo Upload */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Gambar Iklan
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="space-y-3">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-blue-600 hover:text-blue-800 font-semibold">
                            Klik untuk upload gambar iklan
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Format: JPG, PNG • Maksimal: 2MB
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {photo && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-sm text-green-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <strong>Gambar dipilih:</strong> {photo.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Schedule Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-300 focus:outline-none transition-colors"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Durasi (hari)
                    </label>
                    <input
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-300 focus:outline-none transition-colors"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      min="1"
                      placeholder="Jumlah hari"
                    />
                  </div>
                </div>

                {/* Total Cost Display */}
                {duration && selectedAd && parseInt(duration) > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total Biaya:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        Rp {(selectedAd.price * parseInt(duration)).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {duration} hari × Rp {selectedAd.price?.toLocaleString()}/hari
                    </p>
                  </div>
                )}

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
                {paymentMethod && duration && selectedAd && parseInt(duration) > 0 && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <h4 className="font-bold mb-3 text-amber-800 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Instruksi Pembayaran
                    </h4>
                    <div className="text-sm space-y-2 text-amber-700">
                      <p><strong>Transfer ke:</strong> {paymentMethods.find(m => m.id === paymentMethod)?.name}</p>
                      <p><strong>Nomor:</strong> {paymentMethods.find(m => m.id === paymentMethod)?.account}</p>
                      <p><strong>Nama:</strong> {paymentMethods.find(m => m.id === paymentMethod)?.owner}</p>
                      <p><strong>Total:</strong> Rp {(selectedAd.price * parseInt(duration)).toLocaleString()}</p>
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
                      onChange={handleProofChange}
                      className="hidden"
                      id="proof-upload"
                    />
                    <label htmlFor="proof-upload" className="cursor-pointer">
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

            {/* Modal Footer - Always Visible */}
            <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
              <button
                onClick={closeModal}
                className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors font-semibold"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
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
                    Buat Iklan
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