import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { getNewsById } from "../../api/newsApi";

export default function NewsDetail() {
    const { newsId } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNewsDetail();
    }, [newsId]);

    const fetchNewsDetail = async () => {
        try {
            setLoading(true);
            const response = await getNewsById(newsId);
            const newsData = response.data.news || response.data;

            if (!newsData) {
                setError("News not found");
            } else {
                setArticle(newsData);
            }
        } catch (err) {
            console.error("Error fetching news detail:", err);
            setError("Failed to load news. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse text-gray-600">Loading article...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Go back
                </button>
            </div>
        );
    }

    if (!article) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Back to News */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Kembali
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Category Badge */}
                {article.category && (
                    <div className="mb-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                            {article.category}
                        </span>
                    </div>
                )}

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {article.title}
                </h1>

                {/* Meta Information */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            {article.author}
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            5 min read
                        </div>
                    </div>

                    {article.created_at && (
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(article.created_at)}
                        </div>
                    )}
                </div>

                {/* Featured Image */}
                <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                    {article.photo ? (
                        <img
                            src={`http://localhost:5000/uploads/news/${article.photo}`}
                            alt={article.title}
                            className="w-full h-96 object-cover"
                        />
                    ) : (
                        <div className="w-full h-96 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 relative overflow-hidden">
                            {/* Digital Matrix Effect Background */}
                            <div className="absolute inset-0 opacity-30">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-blue-900/40"></div>
                                {/* Simulated matrix dots */}
                                <div className="absolute top-10 left-10 w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                                <div className="absolute top-20 left-32 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                <div className="absolute top-16 right-20 w-2 h-2 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="absolute bottom-20 left-20 w-1 h-1 bg-blue-100 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                <div className="absolute bottom-32 right-32 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.9s' }}></div>
                                <div className="absolute bottom-1/4 left-3/4 w-2 h-2 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '1.1s' }}></div>
                            </div>

                            {/* Digital lines effect */}
                            <div className="absolute inset-0 opacity-40">
                                <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
                                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
                                <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>

                                {/* Vertical lines */}
                                <div className="absolute top-0 bottom-0 left-1/4 w-px bg-gradient-to-b from-transparent via-blue-300 to-transparent"></div>
                                <div className="absolute top-0 bottom-0 right-1/3 w-px bg-gradient-to-b from-transparent via-white to-transparent"></div>
                            </div>

                            {/* Floating particles */}
                            <div className="absolute inset-0 overflow-hidden">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                            animation: `pulse ${2 + Math.random() * 3}s infinite`,
                                            animationDelay: `${Math.random() * 2}s`
                                        }}
                                    ></div>
                                ))}
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-white text-6xl font-bold mb-4 opacity-90 drop-shadow-lg">
                                        {article.category || "NEWS"}
                                    </div>
                                    <div className="text-blue-100 text-lg font-medium opacity-80">
                                        {article.category || "Article"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Article Content */}
                <div className="max-w-none">
                    <div
                        className="max-w-none text-gray-700 leading-relaxed space-y-6"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>
            </div>
        </div>
    );
}