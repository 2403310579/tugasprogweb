import Product from "../models/ProdukModel.js";

export const getProduk = async (req, res) => {
  try {
    const data = await Product.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: "Gagal mengambil data produk" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    // Validasi Input Ketat
    if (!name || typeof name !== "string")
      return res.status(400).json({ msg: "Nama produk harus diisi (teks)" });
    if (isNaN(price) || price <= 0)
      return res
        .status(400)
        .json({ msg: "Harga harus berupa angka dan lebih dari 0" });
    if (isNaN(stock) || stock < 0)
      return res.status(400).json({ msg: "Stok tidak boleh negatif" });

    // 1. Cari apakah produk dengan nama yang sama sudah ada
    const existingProduct = await Product.findOne({
      where: { name: name },
    });

    if (existingProduct) {
      // 2. Jika ADA, update stoknya saja pada ID yang sama
      const newStock = existingProduct.stock + parseInt(stock);
      await Product.update(
        { stock: newStock, price: price }, // Update stok dan harga (opsional)
        { where: { id: existingProduct.id } }
      );

      return res.status(200).json({
        message: "Produk sudah ada, stok berhasil ditambahkan",
        id: existingProduct.id,
        stok_total: newStock,
      });
    }

    // 3. Jika TIDAK ADA, baru buat ID baru
    await Product.create({ name, price, stock });
    res.status(201).json({ message: "Produk baru berhasil ditambah" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Terjadi kesalahan server saat menambah produk" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id, name, price, stock } = req.body;

    // Cek apakah produk ada
    const produk = await Product.findByPk(id);
    if (!produk) return res.status(404).json({ msg: "Produk tidak ditemukan" });

    await Product.update({ name, price, stock }, { where: { id } });
    res.json({ message: "Produk berhasil diupdate" });
  } catch (error) {
    res.status(500).json({ msg: "Gagal mengupdate produk" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;

    const produk = await Product.findByPk(id);
    if (!produk) return res.status(404).json({ msg: "Produk tidak ditemukan" });

    await Product.destroy({ where: { id } });
    res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: "Gagal menghapus produk" });
  }
};
