import express from "express";
import { getUsers, Register, Login, Logout, forgot, deleteUser} from "../controllers/User.js";
import { verifytoken } from "../middleware/VerifyToken.js";
import { getProduk, createProduct, updateProduct, deleteProduct } from "../controllers/Produk.js";
import { getTransaksi, createTransaksi, updateTransaksi, deleteTransaksi } from "../controllers/Transaksi.js";

const router = express.Router();

router.get('/users', verifytoken,getUsers);
router.post(`/register`, Register);
router.post('/login', Login);
router.put('/update', forgot);
router.delete('/delete', deleteUser);
router.get('/produk', getProduk);
router.post('/produk', createProduct); 
router.put('/produk', updateProduct);
router.delete('/produk', deleteProduct);
router.get('/transaksi', getTransaksi);
router.post('/transaksi',createTransaksi);
router.put('/transaksi', updateTransaksi);
router.delete('/transaksi', deleteTransaksi);
router.post('/logout', Logout);


export default router;