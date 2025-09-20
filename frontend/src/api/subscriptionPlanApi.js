import api from "./axios";

// Ambil semua subscription plans
export const getPlans = async (search = "") => {
  return await api.get(`/subscription-plans?search=${search}`);
};

// Tambah paket baru
export const createPlan = async (data) => {
  return await api.post(`/subscription-plans`, data);
};

// Update paket
export const updatePlan = async (id, data) => {
  return await api.put(`/subscription-plans/${id}`, data);
};

// Hapus paket
export const deletePlan = async (id) => {
  return await api.delete(`/subscription-plans/${id}`);
};

// Ambil Total Subscription Active
export const getActiveSubscriptions = async () => {
  return axios.get("/user-subscriptions/active");
};