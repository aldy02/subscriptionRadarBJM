// api/advertisementApi.js
import axios from "./axios";

// Ambil semua iklan
export const getAdvertisements = (params = {}) => {
  return axios.get("/advertisements", { params });
};

// Ambil iklan berdasarkan ID
export const getAdvertisementById = (id) => {
  return axios.get(`/advertisements/${id}`);
};

// Buat iklan baru
export const createAdvertisement = (data) => {
  return axios.post("/advertisements", data);
};

// Update iklan
export const updateAdvertisement = (id, data) => {
  return axios.put(`/advertisements/${id}`, data);
};

// Hapus iklan
export const deleteAdvertisement = (id) => {
  return axios.delete(`/advertisements/${id}`);
};
