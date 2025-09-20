import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { getAllNews } from "../../api/newsApi";

export default function Home() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    fetchLatestNews();
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "customer") {
        const subscription = JSON.parse(localStorage.getItem("subscription") || "null");
        if (subscription?.hasActiveSubscription) {
          setHasActiveSubscription(true);
        }
      } else if (user?.role === "admin") {
        setHasActiveSubscription(true);
      }
    } catch (error) {
      console.error("Failed to check subscription status:", error);
      setHasActiveSubscription(false);
    }
  };

  const fetchLatestNews = async () => {
    try {
      setLoading(true);
      const response = await getAllNews({
        page: 1,
        limit: 1000,
      });

      const newsData = response.data.news || response.data || [];
      setNews(newsData);
      setError(null);
    } catch (err) {
      setError("Gagal memuat berita. Silahkan coba lagi!");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleReadMore = (newsId) => {
    // Check if user has active subscription
    if (!hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }
    
    navigate(`/${newsId}`);
  };

  const handleSubscriptionRedirect = () => {
    setShowSubscriptionModal(false);
    navigate('/subscription');
  };

  const calculateReadTime = (content) => {
    if (!content) return "3 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading berita terbaru...</p>
        </div>
      </div>
    );
  }

  const displayedNews = showAll ? news : news.slice(0, 3);

  return (
    <div className="bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Left aligned */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Berita Terbaru</h2>
          <p className="text-xl text-gray-600 max-w-3xl">
            Tetap update dengan informasi perkembangan dan tren terbaru.
          </p>
          
          {/* Subscription Status Alert */}
          {!hasActiveSubscription && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-yellow-800 font-medium">Subscription Diperlukan</p>
                  <p className="text-yellow-700 text-sm">
                    Beli paket berlangganan untuk membaca berita berita lengkap.{" "}
                    <button
                      onClick={() => navigate('/subscription')}
                      className="underline hover:text-yellow-900 font-medium"
                    >
                      Lihat Paket
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchLatestNews}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && news.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 01-2-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No news available
            </h3>
            <p className="text-gray-600">
              Check back later for the latest updates.
            </p>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedNews.map((article) => (
            <div
              key={article.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                !hasActiveSubscription ? 'relative' : ''
              }`}
            >
              {/* Lock Overlay for non-subscribers */}
              {!hasActiveSubscription && (
                <div className="absolute inset-0 bg-gray-900/20 z-10 flex items-center justify-center">
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <Lock className="w-8 h-8 text-gray-600" />
                  </div>
                </div>
              )}

              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                {article.photo ? (
                  <img
                    src={`http://localhost:5000/uploads/news/${article.photo}`}
                    alt={article.title}
                    className={`w-full h-full object-cover ${
                      !hasActiveSubscription ? 'filter blur-sm' : ''
                    }`}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center ${
                    !hasActiveSubscription ? 'filter blur-sm' : ''
                  }`}>
                    <span className="text-white text-lg font-medium">
                      {article.category || "News"}
                    </span>
                  </div>
                )}
                {/* Category Badge */}
                {article.category && (
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-blue-600 ${
                        !hasActiveSubscription ? 'opacity-50' : ''
                      }`}
                    >
                      {article.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`p-6 ${!hasActiveSubscription ? 'opacity-70' : ''}`}>
                {/* Info */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="mr-4">{formatDate(article.created_at)}</span>
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{calculateReadTime(article.content)}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>

                {/* Content Preview */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {!hasActiveSubscription 
                    ? "Berlangganan untuk membaca artikel lengkap..."
                    : stripHtml(article.content).length > 150
                    ? `${stripHtml(article.content).substring(0, 150)}...`
                    : stripHtml(article.content)
                  }
                </p>

                {/* Read More Button */}
                <button
                  onClick={() => handleReadMore(article.id)}
                  className={`inline-flex items-center font-medium transition-colors duration-200 ${
                    hasActiveSubscription
                      ? 'text-blue-600 hover:text-blue-800'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {hasActiveSubscription ? (
                    <>
                      Read more
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-1" />
                      Subscribe to read
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {news.length > 3 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              {showAll ? "Tampilkan Lebih Sedikit" : "Lihat Semua Berita"}
            </button>
          </div>
        )}
      </div>

      {/* Subscription Required Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-yellow-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Subscription Diperlukan
              </h3>
              
              <p className="text-gray-600 mb-6">
                Untuk membaca artikel berita lengkap, Anda perlu berlangganan terlebih dahulu. Pilih paket yang sesuai dengan kebutuhan Anda.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Nanti
                </button>
                <button
                  onClick={handleSubscriptionRedirect}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  Lihat Paket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}