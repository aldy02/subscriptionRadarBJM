import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import registerImage from "../assets/RadarBJMPhoto.jpg";
import { Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Password validation
        if (formData.password !== formData.confirmPassword) {
            setError("Konfirmasi password tidak sama!");
            return;
        }

        try {
            const res = await api.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            setSuccess(res.data.message || "Registrasi berhasil!");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Terjadi kesalahan saat registrasi");
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Left Section - Form */}
            <div className="hidden md:flex flex-1">
                <img
                    src={registerImage}
                    alt="Newspaper Image"
                    className="w-full h-screen object-cover"
                />
            </div>

            {/* Right Section - Image */}
            <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-md p-6">
                    <h2 className="text-4xl font-bold text-center text-[#1F41BB] mb-3">Register!</h2>
                    <p className="text-center text-sm mb-8">Daftar sekarang untuk mulai menggunakan Subscription Radar Banjarmasin :)</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="text"
                            name="name"
                            placeholder="Nama Lengkap"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />

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

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Konfirmasi Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />

                        {/* Error Alert */}
                        {error && (
                            <div
                                className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
                                role="alert">
                                <svg
                                    className="shrink-0 inline w-4 h-4 me-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span className="font-medium">Error!</span> {error}
                            </div>
                        )}

                        {/* Success Alert */}
                        {success && (
                            <div
                                className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50"
                                role="alert">
                                <svg
                                    className="shrink-0 inline w-4 h-4 me-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path d="M16.707 5.293a1 1 0 0 0-1.414 0L9 11.586 6.707 9.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l7-7a1 1 0 0 0 0-1.414Z" />
                                </svg>
                                <span className="font-medium">Sukses!</span> {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-[#1F41BB] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                            Register
                        </button>
                    </form>

                    <p className="text-center mt-4">
                        Sudah punya akun?{" "}
                        <Link to="/login" className="text-[#1F41BB] hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}