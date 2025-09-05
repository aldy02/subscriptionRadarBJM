import { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, Search, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { getAllNews, deleteNews } from "../../api/newsApi";
import { useNavigate } from "react-router-dom";

const NewsData = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const navigate = useNavigate();

  // State modal delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  // State modal success/error
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultType, setResultType] = useState('');
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    fetchNews();
  }, [search, category, page]);

const fetchNews = async () => {
  try {
    setLoading(true);
    const params = { page, limit };
    if (search) params.search = search;
    if (category && category !== "all") params.category = category;

    const res = await getAllNews(params);
    console.log("DATA NEWS:", res.data);

    setNews(res.data.news || []);
    setTotalNews(res.data.pagination?.totalItems || 0);
    setTotalPages(res.data.pagination?.totalPages || 1); 
  } catch (err) {
    console.error("Error fetching news:", err);
  } finally {
    setLoading(false);
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
    }, 3000);
  };

  // Delete news
  const handleDelete = (newsItem) => {
    setNewsToDelete(newsItem);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteNews(newsToDelete.id);
      showResult('success', 'Berita berhasil dihapus');
      fetchNews();
      setIsDeleteOpen(false);
      setNewsToDelete(null);
    } catch (error) {
      showResult('error', 'Gagal menghapus berita');
      setIsDeleteOpen(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/berita/upload/${id}`);
  };

  // Function to get category badge
  const getCategoryBadge = (category) => {
    const categoryColors = {
      "Keuangan": "bg-green-50 text-green-700 border border-green-200",
      "Bisnis": "bg-blue-50 text-blue-700 border border-blue-200",
      "Politik": "bg-purple-50 text-purple-700 border border-purple-200",
      "Gaya Hidup": "bg-pink-50 text-pink-700 border border-pink-200",
      "Teknologi": "bg-indigo-50 text-indigo-700 border border-indigo-200",
      "Makanan": "bg-orange-50 text-orange-700 border border-orange-200",
      "Hiburan": "bg-red-50 text-red-700 border border-red-200",
      "Olahraga": "bg-yellow-50 text-yellow-700 border border-yellow-200",
    };
    return categoryColors[category] || "bg-gray-50 text-gray-600 border border-gray-200";
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:ml-0">
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 lg:mb-6">
              <div>
                <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">Data Berita</h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">
                  Kelola semua berita dan artikel disini
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:max-w-2xl">
                <div className="relative flex-1 sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Cari berita..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                               bg-white text-sm outline-none transition-all duration-200"
                  />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             bg-white text-sm outline-none transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Keuangan">💰 Keuangan</option>
                  <option value="Bisnis">💼 Bisnis</option>
                  <option value="Politik">🏛️ Politik</option>
                  <option value="Gaya Hidup">✨ Gaya Hidup</option>
                  <option value="Teknologi">💻 Teknologi</option>
                  <option value="Makanan">🍽️ Makanan</option>
                  <option value="Hiburan">🎬 Hiburan</option>
                  <option value="Olahraga">⚽ Olahraga</option>
                </select>
              </div>

              {/* Button Add News */}
              <button
                onClick={() => navigate("/admin/berita/upload")}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm w-full sm:w-auto"
              >
                <Plus size={18} />
                <span className="text-sm lg:text-base">Tambah</span>
              </button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="w-[380px] text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Berita
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Konten
                    </th>
                    <th className="text-center py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
                          <span className="text-gray-500 text-sm">Loading berita...</span>
                        </div>
                      </td>
                    </tr>
                  ) : news.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <div className="text-gray-500">
                          <p className="text-lg font-medium">Berita tidak ditemukan</p>
                          <p className="text-sm mt-1">Coba perbaiki parameter pencarian anda</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    news.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 flex-shrink-0">
                              {item.photo ? (
                                <img
                                  src={`http://localhost:5000/uploads/news/${item.photo}`}
                                  alt={item.title}
                                  className="w-full h-full rounded-lg object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                  <span className="text-gray-400 text-xs">No Image</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 text-sm truncate max-w-xs">
                                {item.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryBadge(item.category)}`}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600">{item.author}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {item.location || <span className="text-gray-400">-</span>}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600 max-w-xs">
                            {item.content ? (
                              <div className="line-clamp-2">
                                {stripHtml(item.content).substring(0, 100)}
                                {stripHtml(item.content).length > 100 && "..."}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center items-center gap-1">
                            <button
                              onClick={() => handleEdit(item.id)}
                              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Desktop Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing {news.length} of {totalNews} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1 || totalPages <= 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    const isActive = page === pageNum;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page >= totalPages || totalPages <= 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
                  <span className="text-gray-500 text-sm">Loading berita...</span>
                </div>
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="text-gray-500">
                  <p className="text-lg font-medium">Berita tidak ditemukan</p>
                  <p className="text-sm mt-1">Coba perbaiki parameter pencarian anda</p>
                </div>
              </div>
            ) : (
              news.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
                >
                  {/* News Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      {item.photo ? (
                        <img
                          src={`http://localhost:5000/uploads/news/${item.photo}`}
                          alt={item.title}
                          className="w-full h-full rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            By {item.author}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getCategoryBadge(item.category)}`}
                        >
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  {item.content && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {stripHtml(item.content)}
                      </p>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-2 text-xs mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Lokasi:</span>
                      <span className="text-gray-700 text-right flex-1 ml-2 truncate">
                        {item.location || <span className="text-gray-400">-</span>}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Mobile Pagination */}
            {news.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1 || totalPages <= 1}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      const isActive = page === pageNum;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page >= totalPages || totalPages <= 1}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Delete Confirmation */}
      {isDeleteOpen && newsToDelete && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Konfirmasi Hapus</h2>
                  <p className="text-sm text-gray-600 mt-1">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <div className="text-center">
                <div className="mb-4">
                  {newsToDelete.photo ? (
                    <img
                      src={`http://localhost:5000/uploads/news/${newsToDelete.photo}`}
                      alt={newsToDelete.title}
                      className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 mx-auto"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200 mx-auto">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-700 mb-2">
                  Apakah Anda yakin ingin menghapus berita:
                </p>
                <p className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                  {newsToDelete.title}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  By {newsToDelete.author}
                </p>
                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  Data yang sudah dihapus tidak dapat dikembalikan!
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteOpen(false);
                  setNewsToDelete(null);
                }}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

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
              <h3 className={`text-lg font-semibold mb-2 ${resultType === 'success' ? 'text-green-700' :
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
                className={`h-full transition-all duration-3000 ease-linear progress-animation ${resultType === 'success' ? 'bg-green-500' :
                  resultType === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        .progress-animation {
          animation: progress-bar 3s linear forwards;
        }
        
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default NewsData;