// api/transactionApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create subscription transaction
export const createSubscriptionTransaction = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/transactions/subscription`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// Get user transaction history
export const getUserTransactions = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/transactions/my-transactions`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// Get transaction by invoice number
export const getTransactionByInvoice = async (invoiceNumber) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/transactions/invoice/${invoiceNumber}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// ===== ADMIN FUNCTIONS =====

// Get all transactions (Admin only)
export const getAllTransactions = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(
      `${API_BASE_URL}/transactions/admin/all?${queryString}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// Update transaction status (Admin only)
export const updateTransactionStatus = async (transactionId, statusData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/transactions/admin/${transactionId}/status`,
      statusData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// Get transaction statistics (Admin only)
export const getTransactionStats = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/transactions/admin/stats`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};