import User from "../models/user.js";
import bcrypt from "bcrypt";

// **Get all users**
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data user" });
    }
};

// **Add new user**
export const createUser = async (req, res) => {
    try {
        const { name, email, role, password } = req.body;

        // Check if email already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, role, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambah user" });
    }
};

// **Update user**
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, role } = req.body;

        // Check if email already exist. Will ok if email not changed
        const existingUser = await User.findOne({ email, _id: { $ne: id } });
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah digunakan" });
        }

        await User.findByIdAndUpdate(id, { name, email, phone, address, role });

        res.status(200).json({ message: "User berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ message: "Gagal update user" });
    }
};

// **Hapus user**
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);

        res.status(200).json({ message: "User berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal hapus user" });
    }
};