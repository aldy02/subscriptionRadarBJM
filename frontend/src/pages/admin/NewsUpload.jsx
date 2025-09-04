import { useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { createNews } from "../../api/newsApi";

export default function NewsUpload() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Keuangan");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      if (photo) formData.append("photo", photo);

      const res = await createNews(formData);
      setMessage({ type: 'success', text: res.data.message });

      // Reset form
      setTitle("");
      setCategory("Keuangan");
      setAuthor("");
      setLocation("");
      setContent("");
      setPhoto(null);
      
      // Reset file input
      document.getElementById('photo-input').value = '';
      
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || "Gagal upload berita" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Berita Baru</h2>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {message.text}
        </div>
      )}

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
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Masukkan judul berita yang menarik..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="Keuangan">💰 Keuangan</option>
              <option value="Bisnis">💼 Bisnis</option>
              <option value="Politik">🏛️ Politik</option>
              <option value="Gaya Hidup">✨ Gaya Hidup</option>
              <option value="Teknologi">💻 Teknologi</option>
              <option value="Makanan & Minuman">🍽️ Makanan & Minuman</option>
              <option value="Hiburan">🎬 Hiburan</option>
              <option value="Olahraga">⚽ Olahraga</option>
            </select>
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
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Lokasi kejadian (opsional)"
          />
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto Berita (JPG/JPEG)
          </label>
          <input
            id="photo-input"
            type="file"
            accept="image/jpeg,image/jpg"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
          />
          <p className="text-sm text-gray-500 mt-1">
            Format: JPG/JPEG, Maksimal 5MB
          </p>
        </div>

        {/* TinyMCE Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Isi Berita <span className="text-red-500">*</span>
          </label>
          <div className="border border-gray-300 rounded-md overflow-hidden">
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
          <p className="text-sm text-gray-500 mt-2">
            💡 Gunakan toolbar di atas untuk formatting text, tambah gambar, dan fitur lainnya
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading || !title || !author || !content}
            className={`px-8 py-3 rounded-md font-medium transition-all duration-200 ${
              loading || !title || !author || !content
                ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengupload...
              </span>
            ) : 'Publish Berita'}
          </button>
        </div>
      </form>
    </div>
  );
}