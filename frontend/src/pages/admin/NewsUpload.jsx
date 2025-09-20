import { useState, useEffect } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { createNews, getNewsById, updateNews } from "../../api/newsApi";
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

export default function NewsUpload() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Keuangan");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // State modal result
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultType, setResultType] = useState('');
  const [resultMessage, setResultMessage] = useState('');

  // Load data jika mode edit
  useEffect(() => {
    if (isEdit) {
      loadNewsData();
    }
  }, [id, isEdit]);

  const loadNewsData = async () => {
    setLoadingData(true);
    try {
      const res = await getNewsById(id);
      const newsData = res.data;
      
      setTitle(newsData.title || "");
      setCategory(newsData.category || "Keuangan");
      setAuthor(newsData.author || "");
      setLocation(newsData.location || "");
      setContent(newsData.content || "");
      setCurrentPhoto(newsData.photo || null);
    } catch (err) {
      console.error("Error loading news data:", err);
      showResult('error', 'Gagal memuat data berita');
    } finally {
      setLoadingData(false);
    }
  };

  // Show result modal
  const showResult = (type, message) => {
    setResultType(type);
    setResultMessage(message);
    setIsResultOpen(true);

    // Auto close after 3 seconds
    setTimeout(() => {
      setIsResultOpen(false);
      // Redirect ke halaman data setelah berhasil
      if (type === 'success') {
        setTimeout(() => {
          navigate('/admin/berita/data');
        }, 500);
      }
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("author", author);
      formData.append("location", location);
      formData.append("content", content);
      
      // Hanya append photo jika ada file baru yang dipilih
      if (photo) {
        formData.append("photo", photo);
      }

      let res;
      if (isEdit) {
        res = await updateNews(id, formData);
        showResult('success', res.data.message || 'Berita berhasil diupdate');
      } else {
        res = await createNews(formData);
        showResult('success', res.data.message || 'Berita berhasil dipublikasi');

        // Reset form jika create
        setTitle("");
        setCategory("Keuangan");
        setAuthor("");
        setLocation("");
        setContent("");
        setPhoto(null);
        setCurrentPhoto(null);

        // Reset file input
        const fileInput = document.getElementById('photo-input');
        if (fileInput) fileInput.value = '';
      }

    } catch (err) {
      showResult('error', err.response?.data?.message || `Gagal ${isEdit ? 'update' : 'upload'} berita`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const handleBackToData = () => {
    navigate('/admin/berita/data');
  };

  if (loadingData) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data berita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      {/* Header dengan back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBackToData}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          type="button"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Edit Berita' : 'Upload Berita Baru'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul Berita <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      focus:outline-none bg-gray-50 focus:bg-white
                      transition-all duration-200"
            placeholder="Masukkan judul berita..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 pr-2 border border-gray-300 rounded-xl
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          focus:outline-none bg-gray-50 focus:bg-white
                          transition-all duration-200 appearance-none cursor-pointer"
                required
              >
                <option value="Keuangan">💰 Keuangan</option>
                <option value="Bisnis">💼 Bisnis</option>
                <option value="Politik">🏛️ Politik</option>
                <option value="Gaya Hidup">✨ Gaya Hidup</option>
                <option value="Teknologi">💻 Teknologi</option>
                <option value="Makanan">🍽️ Makanan</option>
                <option value="Hiburan">🎬 Hiburan</option>
                <option value="Olahraga">⚽ Olahraga</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Penulis <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        focus:outline-none bg-gray-50 focus:bg-white
                        transition-all duration-200"
              placeholder="Nama penulis"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lokasi
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      focus:outline-none bg-gray-50 focus:bg-white
                      transition-all duration-200"
            placeholder="Lokasi (opsional)"
          />
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto Berita (JPG/JPEG)
            {isEdit && !currentPhoto && <span className="text-gray-500 text-sm ml-2">(Tidak ada foto saat ini)</span>}
          </label>
          
          {/* Show current photo if editing */}
          {isEdit && currentPhoto && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Foto saat ini:</p>
              <img
                src={`http://localhost:5000/uploads/news/${currentPhoto}`}
                alt="Current photo"
                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
              <p className="text-xs text-gray-500 mt-1">Pilih foto baru jika ingin mengganti</p>
            </div>
          )}
          
          <input
            id="photo-input"
            type="file"
            accept="image/jpeg,image/jpg"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded-xl
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      focus:outline-none bg-gray-50 focus:bg-white
                      file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
                      file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 
                      hover:file:bg-blue-100 transition-all duration-200"
          />
          <p className="text-sm text-gray-500 mt-1">
            Format: JPG/JPEG, Maksimal 2MB
          </p>
        </div>

        {/* TinyMCE Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Isi Berita <span className="text-red-500">*</span>
          </label>
          <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={content}
              onEditorChange={handleEditorChange}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'wordcount', 'emoticons'
                ],
                toolbar: 'undo redo | formatselect | bold italic underline strikethrough | ' +
                  'forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist outdent indent | removeformat | emoticons charmap | ' +
                  'link image media table | preview code fullscreen',
                toolbar_mode: 'sliding',
                content_style: `
                  body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    font-size: 14px;
                    line-height: 1.6;
                    margin: 16px;
                  }
                  p { margin: 0 0 16px 0; }
                  h1, h2, h3, h4, h5, h6 { 
                    margin: 24px 0 16px 0; 
                    font-weight: 600;
                  }
                `,
                placeholder: 'Mulai menulis isi berita di sini...\n\nTips:\n• Gunakan heading untuk struktur artikel\n• Gunakan bold untuk poin penting\n• Gunakan bullet/numbering untuk daftar',
                branding: false,
                resize: false,
                statusbar: false,
                paste_data_images: true,
                automatic_uploads: true,
                file_picker_types: 'image',
                images_upload_handler: (blobInfo, success, failure) => {
                  // Handle image upload
                  success(`data:${blobInfo.blob().type};base64,${blobInfo.base64()}`);
                }
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl font-medium transition-all duration-200 
                      bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                      focus:ring-2 focus:ring-blue-500 text-white shadow-lg hover:shadow-xl 
                      transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEdit ? 'Mengupdate...' : 'Mengupload...'}
              </span>
            ) : (isEdit ? 'Update Berita' : 'Publish Berita')}
          </button>
        </div>
      </form>

      {/* Modal Result (Success/Error) */}
      {isResultOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-sm overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Modal Body */}
            <div className="px-6 py-8 text-center">
              <div className="mb-4">
                {resultType === 'success' ? (
                  <div className="p-3 bg-green-100 rounded-full w-fit mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                ) : resultType === 'error' ? (
                  <div className="p-3 bg-red-100 rounded-full w-fit mx-auto">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                ) : (
                  <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto">
                    <AlertTriangle className="w-8 h-8 text-blue-600" />
                  </div>
                )}
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                resultType === 'success' ? 'text-green-700' :
                resultType === 'error' ? 'text-red-700' : 'text-blue-700'
              }`}>
                {resultType === 'success' ? 'Berhasil!' :
                  resultType === 'error' ? 'Gagal!' : 'Informasi'}
              </h3>
              <p className="text-gray-600 text-sm">
                {resultMessage}
              </p>
            </div>

            {/* Auto progress bar */}
            <div className="h-1 bg-gray-200">
              <div
                className={`h-full transition-all duration-3000 ease-linear progress-animation ${
                  resultType === 'success' ? 'bg-green-500' :
                  resultType === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}