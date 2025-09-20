import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/RadarBJMPhoto.jpg";
import { Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [subscriptionWarning, setSubscriptionWarning] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", formData);

            // Save token & user data to localstorage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // 🔹 SAVE SUBSCRIPTION DATA IF EXISTS
            if (res.data.subscription) {
                localStorage.setItem("subscription", JSON.stringify(res.data.subscription));
                console.log("Subscription data saved:", res.data.subscription);

                // Show subscription warnings if needed
                if (!res.data.subscription.hasActiveSubscription) {
                    setSubscriptionWarning("Anda tidak memiliki subscription aktif. Silakan berlangganan untuk mengakses konten premium.");
                } else if (res.data.subscription.daysRemaining <= 7) {
                    setSubscriptionWarning(`Subscription Anda akan berakhir dalam ${res.data.subscription.daysRemaining} hari. Perpanjang sekarang!`);
                }
            } else {
                // Clear any existing subscription data for non-customers
                localStorage.removeItem("subscription");
            }

            // Show warning first if exists, then redirect
            if (subscriptionWarning) {
                setTimeout(() => {
                    if (res.data.user.role === "admin") {
                        navigate("/admin");
                    } else {
                        navigate("/");
                    }
                }, 2000); // Wait 2 seconds to show warning
            } else {
                // Immediate redirect if no warnings
                if (res.data.user.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }

        } catch (err) {
            setError(err.response?.data?.message || "Terjadi kesalahan");
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Left Section - Form */}
            <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-md p-6">
                    <h2 className="text-4xl font-bold text-center text-[#1F41BB] mb-3">Login!</h2>
                    <p className="text-center text-sm mb-8">Selamat datang di aplikasi Subscription Radar Banjarmasin :)</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />

                        {error && (
                            <div
                                className="flex items-center p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50"
                                role="alert">
                                <svg
                                    className="shrink-0 inline w-4 h-4 me-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span className="sr-only">Info</span>
                                <div>
                                    <span className="font-medium">Error!</span> {error}
                                </div>
                            </div>
                        )}

                        {subscriptionWarning && (
                            <div
                                className="flex items-center p-4 mb-6 text-sm text-yellow-800 rounded-lg bg-yellow-50"
                                role="alert">
                                <svg
                                    className="shrink-0 inline w-4 h-4 me-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span className="sr-only">Warning</span>
                                <div>
                                    <span className="font-medium">Peringatan!</span> {subscriptionWarning}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-[#1F41BB] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                            Login
                        </button>
                    </form>

                    <p className="text-center mt-4">
                        Belum punya akun?{" "}
                        <Link to="/register" className="text-[#1F41BB] hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Section - Image */}
            <div className="hidden md:flex flex-1">
                <img
                    src={loginImage}
                    alt="Newspaper Image"
                    className="w-full h-screen object-cover" />
            </div>
        </div>
    );
}