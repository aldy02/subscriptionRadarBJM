import { useEffect, useState } from "react";
import { getAllNews, deleteNews } from "../../api/newsApi";
import { useNavigate } from "react-router-dom";

const NewsData = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await getAllNews();
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

  const handleEdit = (id) => {
    navigate(`/news-upload/${id}`);
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      {/* Header dengan tombol tambah */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Cari berita..."
          className="border px-3 py-2 rounded-md"
          disabled
        />
        <button
          onClick={() => navigate("/news-upload")}
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
        <td className="p-2 border flex gap-2">
          <button
            onClick={() => handleEdit(item.id)}
            className="bg-yellow-500 text-white px-2 py-1 rounded-md"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="bg-red-500 text-white px-2 py-1 rounded-md"
          >
            Hapus
          </button>
        </td>
      </tr>
    ))}
    {news.length === 0 && (
      <tr>
        <td colSpan="6" className="text-center p-4">
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
