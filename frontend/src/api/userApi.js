import api from "./axios";

// Get all user
export const getUsers = async (page = 1, limit = 10, search = "") => {
  return await api.get("/users", {
    params: { page, limit, search },
  });
};

// Add user
export const createUser = async (data) => {
  return await api.post("/users", data);
};

// Update user
export const updateUser = async (id, data) => {
  return await api.put(`/users/${id}`, data);
};

// Delete user
export const deleteUser = async (id) => {
  return await api.delete(`/users/${id}`);
};

// Ambil data profil user sendiri
export const getMyProfile = async (token) => {
  return api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update profil user sendiri
export const updateMyProfile = async (formData, token) => {
  return api.put("/users/me", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};