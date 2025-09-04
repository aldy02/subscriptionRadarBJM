import axios from "./axios";

// Upload berita baru
export const createNews = (formData) => {
  return axios.post("/news", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Ambil semua berita
export const getAllNews = () => {
  return axios.get("/news");
};

// Ambil berita by ID
export const getNewsById = (id) => {
  return axios.get(`/news/${id}`);
};

// Update berita
export const updateNews = (id, formData) => {
  return axios.put(`/news/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Hapus berita
export const deleteNews = (id) => {
  return axios.delete(`/news/${id}`);
};