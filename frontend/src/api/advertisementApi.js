import axios from "./axios";

// ===== Advertisement Package APIs =====

// Ambil semua paket iklan
export const getAdvertisements = (params = {}) => {
  return axios.get("/advertisements", { params });
};

// Ambil paket iklan berdasarkan ID
export const getAdvertisementById = (id) => {
  return axios.get(`/advertisements/${id}`);
};

// Buat paket iklan baru (Admin)
export const createAdvertisementPackage = (data) => {
  return axios.post("/advertisements", data);
};

// Update paket iklan (Admin)
export const updateAdvertisement = (id, data) => {
  return axios.put(`/advertisements/${id}`, data);
};

// Hapus paket iklan (Admin)
export const deleteAdvertisement = (id) => {
  return axios.delete(`/advertisements/${id}`);
};

// ===== Advertisement Transaction (Purchase) API =====

// Beli paket iklan (User)
export const createAdvertisement = (formData) => {
  return axios.post("/advertisement-content/purchase", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Ambil iklan milik user
export const getUserAdvertisements = () => {
  return axios.get("/advertisement-content/my-advertisements");
};

// Ambil iklan aktif (Public)
export const getActiveAdvertisements = (params = {}) => {
  return axios.get("/advertisement-content/active", { params });
};

// ===== Admin APIs =====

// Ambil semua konten iklan (Admin)
export const getAllAdvertisementContents = (params = {}) => {
  return axios.get("/advertisement-content/admin/all", { params });
};

// Ambil konten iklan berdasarkan ID (Admin)
export const getAdvertisementContentById = (id) => {
  return axios.get(`/advertisement-content/admin/${id}`);
};