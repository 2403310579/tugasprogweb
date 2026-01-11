import Transaksi from "../models/TransaksiModel.js";
import Produk from "../models/ProdukModel.js";
import Users from "./../models/UserModel.js";

  export const getTransaksi = async (req, res) => {
    try {
        const data = await Transaksi.findAll({
            include: [
                { model: Produk, attributes: ['name', 'price'] },
                { model: Users, attributes: ['name',] } // Ini akan menampilkan nama user
            ]
        });
        res.json(data);
    } catch (error) {
        
        res.status(500).json({ msg: "Terjadi kesalahan" });
    }

};

export const createTransaksi = async (req, res) => {
  try {
    const { product_id, qty, user_id } = req.body; // Tambahkan user_id di sini

    const produk = await Produk.findByPk(product_id);
    if (!produk)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    if (produk.stock < qty)
      return res.status(400).json({ msg: "Stok tidak mencukupi" });

    const total_price = produk.price * qty;

    // Validasi: Pastikan user_id dikirim agar tidak null di database
    if (!user_id) return res.status(400).json({ msg: "User ID wajib diisi" });

    await Transaksi.create({
      product_id,
      user_id, // Sekarang user_id akan masuk ke database
      qty,
      total_price,
    });

    produk.stock -= qty;
    await produk.save();

    res.json({ message: "Transaksi berhasil", total_price });
  } catch (error) {
    res.status(500).json({ msg: "Terjadi kesalahan" });
  }
};

export const updateTransaksi = async (req, res) => {
  try {
    const { id, product_id, qty } = req.body;

    // Validasi keberadaan transaksi
    const transaksi = await Transaksi.findByPk(id);
    if (!transaksi)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    // Validasi keberadaan produk
    const produk = await Produk.findByPk(product_id);
    if (!produk)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    // Hitung selisih stok (stok lama dibalikan, stok baru dikurangi)
    const selisih = qty - transaksi.qty;
    if (produk.stock < selisih) {
      return res.status(400).json({
        msg: "Stok tidak mencukupi untuk perubahan ini",
        stok_tersisa: produk.stock,
      });
    }

    const total_price = produk.price * qty;

    await transaksi.update({ product_id, qty, total_price });

    produk.stock -= selisih;
    await produk.save();

    res.json({
      message: "Transaksi berhasil diupdate",
      nama_produk: produk.name,
      total_price,
      stok_sisa: produk.stock,
    });
  } catch (err) {
    res.status(500).json({ msg: "Terjadi kesalahan saat update" });
  }
};

export const deleteTransaksi = async (req, res) => {
  try {
    const { id } = req.body;

    // Cek dulu apakah transaksi ada sebelum dihapus
    const transaksi = await Transaksi.findByPk(id);
    if (!transaksi)
      return res.status(404).json({ msg: "Transaksi tidak ditemukan" });

    await Transaksi.destroy({ where: { id } });
    res.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: "Gagal menghapus transaksi" });
  }
};

Users.hasMany(Transaksi, { foreignKey: "user_id" });
Transaksi.belongsTo(Users, { foreignKey: "user_id" });