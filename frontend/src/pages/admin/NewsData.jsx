import { useEffect, useState } from "react";
import { getAllNews, deleteNews } from "../../api/newsApi";
import { useNavigate } from "react-router-dom";

const NewsData = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, [search, category]);

  const fetchNews = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category && category !== "all") params.category = category;

      const res = await getAllNews(params);
      console.log("DATA NEWS:", res.data);
      setNews(res.data.news || []);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin mau hapus berita ini?")) {
      try {
        await deleteNews(id);
        setNews((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Error deleting news:", err);
      }
    }
  };

  // Perbaiki navigasi untuk edit
  const handleEdit = (id) => {
    navigate(`/admin/berita/upload/${id}`);
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      {/* Header dengan tombol tambah */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Cari berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="all">Semua Kategori</option>
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
        <button
          onClick={() => navigate("/admin/berita/upload")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Tambah
        </button>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Judul</th>
              <th className="p-2 border">Kategori</th>
              <th className="p-2 border">Author</th>
              <th className="p-2 border">Lokasi</th>
              <th className="p-2 border">Konten</th>
              <th className="p-2 border">Foto</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-2 border">{item.title}</td>
                <td className="p-2 border">{item.category}</td>
                <td className="p-2 border">{item.author}</td>
                <td className="p-2 border">{item.location || "-"}</td>
                <td className="p-2 border">
                  {item.content ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          item.content.length > 100
                            ? item.content.substring(0, 100) + "..."
                            : item.content,
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2 border text-center">
                  {item.photo ? (
                    <img
                      src={`http://localhost:5000/uploads/news/${item.photo}`}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md mx-auto"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No Image</span>
                  )}
                </td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {news.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  Tidak ada berita.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsData;