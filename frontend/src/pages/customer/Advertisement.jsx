import { useEffect, useState } from "react";
import {
  getAdvertisements,
  createAdvertisement,
} from "../../api/advertisementApi";

export default function Advertisement() {
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // form states
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const paymentMethods = [
    { id: "bca", name: "BCA - 098877887", account: "098877887", owner: "Aldy Rahman" },
    { id: "gopay", name: "GoPay - 081234567890", account: "081234567890", owner: "Aldy Rahman" },
  ];

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await getAdvertisements();
        console.log("API response:", res.data);
        setAds(res.data.data || []); // fallback array kosong
      } catch (err) {
        console.error("Fetch ads error:", err);
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

  const handleSubmit = async () => {
    if (!paymentMethod || !proofFile || !content || !startDate || !duration) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("package_id", selectedAd.id);
      formData.append("content", content);
      formData.append("photo", photo);
      formData.append("start_date", startDate);
      formData.append("duration", duration);
      formData.append("payment_method", paymentMethod);
      formData.append("proof_payment", proofFile);

      const result = await createAdvertisement(formData);

      alert(`Iklan berhasil dibuat! ID: ${result.data.id}`);
      closeModal();
    } catch (error) {
      console.error("Submit ad error:", error);
      alert(error.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pilih Paket Iklan</h1>
          <p className="text-xl text-gray-600">Pasang iklan Anda sesuai kebutuhan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform"
            >
              {/* Nama & Size */}
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                {ad.name}
              </h3>
              <p className="text-center text-sm text-gray-500 mb-4">{ad.size}</p>

              {/* Harga & Durasi */}
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-blue-600">
                  Rp{ad.price?.toLocaleString()}
                </span>
                <p className="text-gray-600 mt-1">{ad.durasi} hari</p>
              </div>

              <button
                onClick={() => handleBuy(ad)}
                className="w-full py-2 px-6 rounded-xl bg-gray-900 text-white hover:bg-gray-800"
              >
                Beli Paket
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Beli {selectedAd?.name}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Detail Paket */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-2">Detail Paket</h3>
              <p><strong>Nama:</strong> {selectedAd?.name}</p>
              <p><strong>Ukuran:</strong> {selectedAd?.size}</p>
              <p><strong>Durasi:</strong> {selectedAd?.durasi} hari</p>
              <p className="text-lg font-bold text-blue-600">
                <strong>Harga:</strong> Rp{selectedAd?.price?.toLocaleString()}
              </p>
            </div>

            {/* Input Konten Iklan */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Isi Konten Iklan</label>
              <textarea
                className="w-full border rounded-lg p-2"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis isi iklan..."
              />
            </div>

            {/* Upload Gambar */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Foto/Gambar Iklan</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>

            {/* Start Date */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Tanggal Mulai</label>
              <input
                type="date"
                className="w-full border rounded-lg p-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* Durasi */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Durasi (hari)</label>
              <input
                type="number"
                className="w-full border rounded-lg p-2"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
              />
            </div>

            {/* Metode Pembayaran */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Metode Pembayaran</label>
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className="flex items-center gap-2 p-2 border rounded-lg mb-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>{method.name} a/n {method.owner}</span>
                </label>
              ))}
            </div>

            {/* Upload Bukti Pembayaran */}
            <div className="mb-6">
              <label className="block font-medium mb-1">Bukti Pembayaran</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProofFile(e.target.files[0])}
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}