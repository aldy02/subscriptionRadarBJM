import User from "../models/user.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    // pagination + search
    const { count, rows } = await User.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${search}%`
        }
      },
      attributes: { exclude: ["password"] },
      offset: Number(offset),
      limit: Number(limit),
    });

    res.status(200).json({
      data: rows,
      total: count,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    console.error("Error getAllUsers:", error);
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
};

// Add new user
export const createUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    // Check if email already exist
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User berhasil ditambahkan" });
  } catch (error) {
    console.error("Error createUser:", error);
    res.status(500).json({ message: "Gagal menambah user" });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, role } = req.body;

    // Check if email already exist
    const existingUser = await User.findOne({
      where: {
        email,
        id: { [Op.ne]: id }
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    await User.update(
      { name, email, phone, address, role },
      { where: { id } }
    );

    res.status(200).json({ message: "User berhasil diperbarui" });
  } catch (error) {
    console.error("Error updateUser:", error);
    res.status(500).json({ message: "Gagal update user" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("Error deleteUser:", error);
    res.status(500).json({ message: "Gagal hapus user" });
  }
};