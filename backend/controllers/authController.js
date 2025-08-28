const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const path = require("path");

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exist
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profile_photo: "default.jpg",
      role: "non-subscriber",
      phone: null,
      address: null,
    });

    res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profile_photo: `${req.protocol}://${req.get("host")}/uploads/${newUser.profile_photo}`
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Search user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Buat JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_photo: `${req.protocol}://${req.get("host")}/uploads/${user.profile_photo}`
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Search by id
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Check if email already used when try to replace email address
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ message: "Email sudah digunakan" });
      }
    }

    // Upload photo
    let profilePhoto = user.profile_photo;
    if (req.file) {
      profilePhoto = req.file.filename;
    }

    // Update data user
    await user.update({
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone,
      address: address || user.address,
      profile_photo: profilePhoto
    });

    res.json({
      message: "Profil berhasil diperbarui",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profile_photo: `${req.protocol}://${req.get("host")}/uploads/${user.profile_photo}`
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
