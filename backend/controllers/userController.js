import User from "../models/user.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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
    const { name, email, role, password, phone, address } = req.body;

    // Validasi wajib isi
    if (!name || !email || !role || !password || !phone || !address) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

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
      phone,
      address,
      profile_photo: "default.jpg",
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

    const { name, email, phone, address, role } = req.body

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

// Controller for setting menu start
// Update profile (for logged in user)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const body = req.body || {};
    const { name, email, phone, address, password, confirmPassword } = body;

    let updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    // Update password
    if (password) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Konfirmasi password tidak sama!" });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Kalau ada file baru
    if (req.file) {
      // Ambil data user lama
      const user = await User.findByPk(userId);

      // Hapus foto lama kalau bukan default
      if (user.profile_photo && user.profile_photo !== "default.jpg") {
        const oldPath = path.join(__dirname, "../uploads", user.profile_photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Simpan foto baru
      updateData.profile_photo = req.file.filename;
    }

    await User.update(updateData, { where: { id: userId } });

    res.status(200).json({ message: "Profil berhasil diperbarui" });
  } catch (error) {
    console.error("Error updateProfile:", error);
    res.status(500).json({ message: "Gagal update profil" });
  }
};

// Get profile (for logged in user)
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id; // dari JWT
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }, // jangan kirim password
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getMyProfile:", error);
    res.status(500).json({ message: "Gagal mengambil profil" });
  }
};
// Controller for setting menu end

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