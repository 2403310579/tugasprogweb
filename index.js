//import module yang diperlukan
import express from "express";
import db from "./config/Database.js";
import router from "./routes/index.js";
import dotenv from "dotenv";
// import Users from "./models/UserModel.js";
// import Product from "./models/ProdukModel.js";
// import Transaksi from "./models/TransaksiModel.js";
import cookieParser from "cookie-parser";


dotenv.config();
const app = express()

try{
    await db.authenticate();
    console.log(`Berhasil terkoneksi ke database`);
    console.log(`Localhost: http://localhost:3000`);
    await db.sync({ alter: true });
    // await Users.sync();
    // await Product.sync();
    // await Transaksi.sync();
} catch (error) {
    console.log(error);
}
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(router);


app.listen(3000, () => {
    console.log(`kelompok 9`)
});

