import SubscriptionPlan from "../models/subscriptionPlan.js";
import { Op } from "sequelize"

// Get all subscription plans
export const getAllPlans = async (req, res) => {
  try {
    const { search } = req.query;

    const whereClause = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const plans = await SubscriptionPlan.findAll({
      where: whereClause,
    });

    res.status(200).json(plans);
  } catch (error) {
    console.error("Error getAllPlans:", error);
    res.status(500).json({ message: "Gagal mengambil data paket" });
  }
};

// Create new plan
export const createPlan = async (req, res) => {
  try {
    const { name, duration, price, description } = req.body;

    if (!name || !duration || !price || !description) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const newPlan = await SubscriptionPlan.create({
      name,
      duration,
      price,
      description,
    });

    res.status(201).json({ message: "Paket berhasil ditambahkan", data: newPlan });
  } catch (error) {
    console.error("Error createPlan:", error);
    res.status(500).json({ message: "Gagal menambah paket" });
  }
};


// Update plan
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, price, description } = req.body;

    const plan = await SubscriptionPlan.findByPk(id);
    if (!plan) return res.status(404).json({ message: "Paket tidak ditemukan" });

    await plan.update({ name, duration, price, description });

    res.status(200).json({ message: "Paket berhasil diperbarui", data: plan });
  } catch (error) {
    console.error("Error updatePlan:", error);
    res.status(500).json({ message: "Gagal update paket" });
  }
};

// Delete plan
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await SubscriptionPlan.findByPk(id);

    if (!plan) return res.status(404).json({ message: "Paket tidak ditemukan" });

    await plan.destroy();
    res.status(200).json({ message: "Paket berhasil dihapus" });
  } catch (error) {
    console.error("Error deletePlan:", error);
    res.status(500).json({ message: "Gagal hapus paket" });
  }
};