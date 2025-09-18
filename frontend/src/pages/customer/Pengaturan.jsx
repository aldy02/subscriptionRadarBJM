import { useEffect, useState } from "react";
import { Save, Edit3 } from "lucide-react";
import { getMyProfile, updateMyProfile } from "../../api/userApi";
import ResultModal from "../../components/ResultModal";

export default function Pengaturan() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Result modal state
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultType, setResultType] = useState('');
  const [resultMessage, setResultMessage] = useState('');

  const token = localStorage.getItem("token");

  // Show result modal
  const showResult = (type, message) => {
    setResultType(type);
    setResultMessage(message);
    setIsResultOpen(true);

    // Auto close after 3 seconds
    setTimeout(() => {
      setIsResultOpen(false);
    }, 3000);
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setInitialLoading(true);
        const res = await getMyProfile(token);
        setForm({
          ...form,
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          role: res.data.role || "",
        });
        // Set preview image if profile photo exists
        if (res.data.profile_photo) {
          setPreviewImage(`http://localhost:5000/uploads/${res.data.profile_photo}`);
        }
      } catch (err) {
        console.error("Gagal ambil profil:", err);
        showResult('error', 'Gagal memuat data profil');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle profile photo change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      // Create preview URL
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (form.password && form.password !== form.confirmPassword) {
      showResult('error', 'Konfirmasi password tidak cocok!');
      return;
    }

    if (!form.name.trim()) {
      showResult('error', 'Nama tidak boleh kosong!');
      return;
    }

    if (!form.email.trim()) {
      showResult('error', 'Email tidak boleh kosong!');
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    });
    if (profilePhoto) formData.append("profile_photo", profilePhoto);

    setLoading(true);
    try {
      await updateMyProfile(formData, token);
      showResult('success', 'Profil berhasil diperbarui!');
      // Clear password fields after successful update
      setForm(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
      setProfilePhoto(null);
    } catch (err) {
      console.error("Gagal update profil:", err);
      const errorMessage = err.response?.data?.message || "Gagal memperbarui profil!";
      showResult('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
          <span className="text-gray-600 font-medium">Memuat profil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:ml-0">
        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 lg:mb-6">
              <div>
                <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">Pengaturan Akun</h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">
                  Kelola informasi pribadi dan preferensi akun Anda
                </p>
              </div>
            </div>
          </div>

          {/* Main Settings Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                {/* Profile Photo Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Foto Profil</h2>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                        <img
                          src={previewImage || `http://localhost:5000/uploads/default.jpg`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `http://localhost:5000/uploads/default.jpg`;
                          }}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        <label
                          htmlFor="profile_photo"
                          className="flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer shadow-sm transition-colors duration-200"
                        >
                          <Edit3 className="w-4 h-4" />
                        </label>
                        <input
                          id="profile_photo"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {form.name || "Nama Pengguna"}
                      </h3>
                      <p className="text-gray-600 text-sm">{form.email}</p>
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 mt-2 capitalize">
                        {form.role || "customer"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-8"></div>

                {/* Personal Information Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Informasi Pribadi</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none duration-200"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Masukkan alamat email"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Telepon
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Masukkan nomor telepon"
                      />
                    </div>

                    {/* Role (Read Only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role Pengguna
                      </label>
                      <input
                        type="text"
                        value={form.role === 'admin' ? 'Admin' : 'Customer'}
                        disabled
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alamat
                      </label>
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2.5 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                        placeholder="Masukkan alamat lengkap"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-8"></div>

                {/* Security Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Keamanan</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Kosongkan jika tidak ingin mengubah"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konfirmasi Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Ulangi password baru"
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-700">
                      <strong>Catatan:</strong> Kosongkan field password jika tidak ingin mengubah password saat ini.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 min-w-[120px]"
                >
                  {loading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <ResultModal
        isOpen={isResultOpen}
        type={resultType}
        message={resultMessage}
        onClose={() => setIsResultOpen(false)}
      />
    </div>
  );
}