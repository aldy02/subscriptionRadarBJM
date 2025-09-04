const News = require("../models/news");
const fs = require('fs').promises;
const path = require('path');

// Create
exports.createNews = async (req, res) => {
  try {
    const { title, category, author, location, content } = req.body;
    
    // Input validation
    if (!title || !category || !author || !content) {
      return res.status(400).json({ 
        message: "Title, category, author, dan content wajib diisi" 
      });
    }

    const photo = req.file ? req.file.filename : null;

    const news = await News.create({
      title: title.trim(),
      category,
      author: author.trim(),
      location: location ? location.trim() : null,
      content,
      photo,
    });

    res.status(201).json({ 
      message: "Berita berhasil ditambahkan", 
      news: {
        id: news.id,
        title: news.title,
        category: news.category,
        author: news.author,
        location: news.location,
        content: news.content,
        photo: news.photo,
        created_at: news.created_at
      }
    });
  } catch (err) {
    // Remove file if failed upload to db
    if (req.file) {
      try {
        await fs.unlink(path.join('uploads/news', req.file.filename));
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    
    console.error('Create news error:', err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Read all with pagination
exports.getAllNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const category = req.query.category;

    let whereClause = {};
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    const { count, rows: news } = await News.findAndCountAll({ 
      where: whereClause,
      order: [["created_at", "DESC"]],
      limit,
      offset,
      attributes: ['id', 'title', 'category', 'author', 'location', 'photo', 'content', 'created_at', 'updated_at']
    });

    res.json({
      news,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    console.error('Get all news error:', err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Read by id
exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "ID berita tidak valid" });
    }

    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    res.json(news);
  } catch (err) {
    console.error('Get news by ID error:', err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Update
exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, author, location, content } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "ID berita tidak valid" });
    }

    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    // Input validation
    if (!title || !category || !author || !content) {
      return res.status(400).json({ 
        message: "Title, category, author, dan content wajib diisi" 
      });
    }

    const oldPhoto = news.photo;
    const photo = req.file ? req.file.filename : oldPhoto;

    await news.update({ 
      title: title.trim(),
      category,
      author: author.trim(),
      location: location ? location.trim() : null,
      content,
      photo 
    });

    // Delete old photo if new photo exist
    if (req.file && oldPhoto) {
      try {
        await fs.unlink(path.join('uploads/news', oldPhoto));
      } catch (unlinkError) {
        console.error('Error deleting old photo:', unlinkError);
      }
    }

    res.json({ 
      message: "Berita berhasil diupdate", 
      news: {
        id: news.id,
        title: news.title,
        category: news.category,
        author: news.author,
        location: news.location,
        content: news.content,
        photo: news.photo,
        updated_at: news.updated_at
      }
    });
  } catch (err) {
    console.error('Update news error:', err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Delete
exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "ID berita tidak valid" });
    }

    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    const photoToDelete = news.photo;

    await news.destroy();

    if (photoToDelete) {
      try {
        await fs.unlink(path.join('uploads/news', photoToDelete));
      } catch (unlinkError) {
        console.error('Error deleting photo:', unlinkError);
      }
    }

    res.json({ message: "Berita berhasil dihapus" });
  } catch (err) {
    console.error('Delete news error:', err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};